import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/shared/hooks';
import { type AgentMessage, generateGroupMeta } from '@/shared/state/agentsSlice';
import type { ToolPair } from '../ToolCallBubble';
import { type RenderItem, type ToolGroup, isToolGroup, isToolPair } from '../ToolGroupBubble';
import { CONTEXT_WINDOWS } from '../ThinkingBubble';

function stringifyContent(content: any): string {
  if (content == null) return '';
  return typeof content === 'string' ? content : JSON.stringify(content);
}

export function useMessageRendering(session: any, model: string, id: string | undefined, isDraft: boolean) {
  const dispatch = useAppDispatch();

  const activeBranchMessages: AgentMessage[] = useMemo(() => {
    if (!session) return [];
    const branchId = session.active_branch_id || 'main';
    const branch = session.branches?.[branchId];
    if (!branch || !branch.fork_point_message_id) {
      return session.messages.filter((m: AgentMessage) => m.branch_id === 'main' || m.branch_id === branchId);
    }
    const segments: Array<{ branchId: string; upToMessageId?: string }> = [];
    let cur = branch;
    let curId = branchId;
    while (cur && cur.fork_point_message_id) {
      segments.unshift({ branchId: curId, upToMessageId: cur.fork_point_message_id });
      curId = cur.parent_branch_id || 'main';
      cur = session.branches?.[curId];
    }
    segments.unshift({ branchId: curId });
    const result: AgentMessage[] = [];
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const nextForkMsgId = seg.upToMessageId;
      if (nextForkMsgId) {
        const forkIdx = session.messages.findIndex((m: AgentMessage) => m.id === nextForkMsgId);
        result.push(...session.messages.slice(0, forkIdx).filter((m: AgentMessage) => m.branch_id === seg.branchId));
      } else if (i < segments.length - 1) {
        const nextFork = segments[i + 1].upToMessageId;
        const forkIdx = nextFork ? session.messages.findIndex((m: AgentMessage) => m.id === nextFork) : session.messages.length;
        result.push(...session.messages.slice(0, forkIdx).filter((m: AgentMessage) => m.branch_id === seg.branchId));
      } else {
        result.push(...session.messages.filter((m: AgentMessage) => m.branch_id === seg.branchId));
      }
    }
    const leafMsgs = session.messages.filter((m: AgentMessage) => m.branch_id === branchId);
    if (!result.some((m: AgentMessage) => m.branch_id === branchId)) result.push(...leafMsgs);
    return result;
  }, [session?.messages, session?.active_branch_id, session?.branches]);

  const renderItems: RenderItem[] = useMemo(() => {
    const isOutputCall = (m: AgentMessage) =>
      m.role === 'tool_call' && typeof m.content === 'object' && m.content.tool === 'RenderOutput';
    const isOutputResult = (m: AgentMessage) => {
      if (m.role !== 'tool_result') return false;
      try {
        const parsed = typeof m.content === 'string' ? JSON.parse(m.content) : m.content;
        return !!(parsed?.output_id && parsed?.frontend_code);
      } catch { return false; }
    };
    const items: RenderItem[] = [];
    let i = 0;
    while (i < activeBranchMessages.length) {
      const msg = activeBranchMessages[i];
      if (msg.role === 'tool_call' || msg.role === 'tool_result') {
        const group: AgentMessage[] = [];
        while (i < activeBranchMessages.length && (activeBranchMessages[i].role === 'tool_call' || activeBranchMessages[i].role === 'tool_result')) {
          group.push(activeBranchMessages[i]);
          i++;
        }
        const regular: AgentMessage[] = [];
        const outputItems: AgentMessage[] = [];
        for (const m of group) {
          if (isOutputCall(m) || isOutputResult(m)) { outputItems.push(m); continue; }
          regular.push(m);
        }
        const calls = regular.filter((m) => m.role === 'tool_call');
        const results = regular.filter((m) => m.role === 'tool_result');
        const pairs: ToolPair[] = calls.map((call, idx) => ({
          type: 'tool_pair' as const, id: `pair-${call.id}`, call, result: results[idx] || null,
        }));
        const mcpServers = new Set(
          calls.map((m) => {
            const tool = typeof m.content === 'object' ? m.content.tool || '' : '';
            const match = tool.match(/^mcp__([^_]+(?:-[^_]+)*)__/);
            return match ? match[1] : '';
          }).filter(Boolean)
        );
        const allSameMcp = mcpServers.size === 1 && pairs.length > 0;
        if (allSameMcp) {
          const mcpServer = [...mcpServers][0];
          const toolNames = new Set(calls.map((m) => (typeof m.content === 'object' ? m.content.tool : '')));
          const label = toolNames.size === 1 ? calls[0].content?.tool || 'Tool calls' : `${calls.length} tool calls`;
          items.push({ type: 'tool_group', id: `group-${group[0].id}`, pairs, label, callCount: calls.length, mcpServer } satisfies ToolGroup);
        } else if (pairs.length <= 2) {
          items.push(...pairs);
        } else if (pairs.length > 0) {
          const toolNames = new Set(calls.map((m) => (typeof m.content === 'object' ? m.content.tool : '')));
          const label = toolNames.size === 1 ? calls[0].content?.tool || 'Tool calls' : `${calls.length} tool calls`;
          items.push({ type: 'tool_group', id: `group-${group[0].id}`, pairs, label, callCount: calls.length } satisfies ToolGroup);
        }
        items.push(...outputItems);
      } else {
        if (!msg.hidden) items.push(msg);
        i++;
      }
    }
    return items;
  }, [activeBranchMessages]);

  const lastAssistantIdsInTurn = useMemo(() => {
    const ids = new Set<string>();
    let lastAssistantId: string | null = null;
    for (const item of renderItems) {
      if (!isToolGroup(item) && !isToolPair(item)) {
        const msg = item as AgentMessage;
        if (msg.role === 'assistant') lastAssistantId = msg.id;
        else if (msg.role === 'user') {
          if (lastAssistantId) ids.add(lastAssistantId);
          lastAssistantId = null;
        }
      }
    }
    if (lastAssistantId) ids.add(lastAssistantId);
    return ids;
  }, [renderItems]);

  const groupMetaRequestedRef = useRef(new Set<string>());
  const groupMetaRefinedRef = useRef(new Set<string>());
  useEffect(() => {
    if (!id || isDraft) return;
    const toolGroups = renderItems.filter(isToolGroup) as ToolGroup[];
    const meta = session?.tool_group_meta ?? {};
    for (const group of toolGroups) {
      const allDone = group.pairs.every((p) => p.result !== null);
      if (!groupMetaRequestedRef.current.has(group.id) && !meta[group.id]) {
        groupMetaRequestedRef.current.add(group.id);
        const toolCalls = group.pairs.map((p) => {
          const c = p.call.content;
          const tool = typeof c === 'object' ? c.tool || '' : '';
          const input = typeof c === 'object' ? c.input : '';
          return { tool, input_summary: (typeof input === 'string' ? input : JSON.stringify(input)).slice(0, 120) };
        });
        dispatch(generateGroupMeta({ sessionId: id, groupId: group.id, toolCalls }));
      }
      if (allDone && meta[group.id] && !meta[group.id].is_refined && !groupMetaRefinedRef.current.has(group.id)) {
        groupMetaRefinedRef.current.add(group.id);
        const toolCalls = group.pairs.map((p) => {
          const c = p.call.content;
          const tool = typeof c === 'object' ? c.tool || '' : '';
          const input = typeof c === 'object' ? c.input : '';
          return { tool, input_summary: (typeof input === 'string' ? input : JSON.stringify(input)).slice(0, 120) };
        });
        const resultsSummary = group.pairs.filter((p) => p.result).map((p) => {
          const rc = p.result!.content;
          const text = typeof rc === 'string' ? rc : typeof rc === 'object' && rc?.text ? rc.text : JSON.stringify(rc);
          return text.slice(0, 150);
        });
        dispatch(generateGroupMeta({ sessionId: id, groupId: group.id, toolCalls, resultsSummary, isRefinement: true }));
      }
    }
  }, [renderItems, id, isDraft, session?.tool_group_meta, dispatch]);

  const getSiblingBranches = useCallback((messageId: string): string[] => {
    if (!session?.branches) return [];
    const directForks = Object.values(session.branches)
      .filter((b: any) => b.fork_point_message_id === messageId).map((b: any) => b.id);
    if (directForks.length > 0) {
      const originalMsg = session.messages.find((m: AgentMessage) => m.id === messageId);
      return [originalMsg?.branch_id || 'main', ...directForks];
    }
    const msg = session.messages.find((m: AgentMessage) => m.id === messageId);
    if (!msg || msg.role !== 'user') return [];
    const msgBranch = session.branches[msg.branch_id];
    if (!msgBranch?.fork_point_message_id) return [];
    const branchUserMsgs = session.messages.filter(
      (m: AgentMessage) => m.branch_id === msg.branch_id && m.role === 'user'
    );
    if (branchUserMsgs.length === 0 || branchUserMsgs[0].id !== messageId) return [];
    const forkPointId = msgBranch.fork_point_message_id;
    const siblingBranches = Object.values(session.branches)
      .filter((b: any) => b.fork_point_message_id === forkPointId).map((b: any) => b.id);
    return [msgBranch.parent_branch_id || 'main', ...siblingBranches];
  }, [session?.branches, session?.messages]);

  const contextEstimate = useMemo(() => {
    const limit = CONTEXT_WINDOWS[model] || 200_000;
    let chars = (session?.system_prompt || '').length;
    for (const msg of activeBranchMessages) chars += stringifyContent(msg.content).length;
    if (session?.streamingMessage) chars += (session.streamingMessage.content || '').length;
    return { used: Math.round(chars / 4), limit };
  }, [activeBranchMessages, session?.system_prompt, session?.streamingMessage?.content, model]);

  return { activeBranchMessages, renderItems, lastAssistantIdsInTurn, getSiblingBranches, contextEstimate };
}
