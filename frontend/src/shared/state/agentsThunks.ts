import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '@/shared/config';
import type {
  AgentSession, AgentConfig, HistorySession,
  SendMessagePayload, LaunchAndSendPayload,
  GenerateGroupMetaPayload, SearchHistoryParams,
} from './agentsTypes';

const AGENTS_API = `${API_BASE}/agents`;

export const fetchSessions = createAsyncThunk(
  'agents/fetchSessions',
  async ({ dashboardId }: { dashboardId?: string } = {}) => {
    const params = new URLSearchParams();
    if (dashboardId) params.set('dashboard_id', dashboardId);
    const qs = params.toString();
    const res = await fetch(`${AGENTS_API}/sessions${qs ? `?${qs}` : ''}`);
    const data = await res.json();
    return data.sessions as AgentSession[];
  },
);

export const launchAgent = createAsyncThunk('agents/launchAgent', async (config: AgentConfig) => {
  const res = await fetch(`${AGENTS_API}/launch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  const data = await res.json();
  return data.session as AgentSession;
});

export const sendMessage = createAsyncThunk(
  'agents/sendMessage',
  async ({ sessionId, prompt, mode, model, provider, images, contextPaths, forcedTools, attachedSkills, hidden, selectedBrowserIds }: SendMessagePayload) => {
    await fetch(`${AGENTS_API}/sessions/${sessionId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mode, model, provider, images, context_paths: contextPaths, forced_tools: forcedTools, attached_skills: attachedSkills, hidden, selected_browser_ids: selectedBrowserIds }),
    });
    return { sessionId, prompt };
  }
);

export const stopAgent = createAsyncThunk(
  'agents/stopAgent',
  async ({ sessionId, removeWorktree = false }: { sessionId: string; removeWorktree?: boolean }) => {
    await fetch(`${AGENTS_API}/sessions/${sessionId}/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remove_worktree: removeWorktree }),
    });
    return sessionId;
  }
);

export const editMessage = createAsyncThunk(
  'agents/editMessage',
  async ({ sessionId, messageId, content }: { sessionId: string; messageId: string; content: string }) => {
    await fetch(`${AGENTS_API}/sessions/${sessionId}/edit_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id: messageId, content }),
    });
    return { sessionId, messageId, content };
  }
);

export const switchBranch = createAsyncThunk(
  'agents/switchBranch',
  async ({ sessionId, branchId }: { sessionId: string; branchId: string }) => {
    await fetch(`${AGENTS_API}/sessions/${sessionId}/switch_branch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch_id: branchId }),
    });
    return { sessionId, branchId };
  }
);

export const fetchSession = createAsyncThunk(
  'agents/fetchSession',
  async (sessionId: string) => {
    const res = await fetch(`${AGENTS_API}/sessions/${sessionId}`);
    const session = await res.json();
    return session as AgentSession;
  }
);

export const launchAndSendFirstMessage = createAsyncThunk(
  'agents/launchAndSendFirstMessage',
  async ({ draftId, config, prompt, mode, model, provider, images, contextPaths, forcedTools, attachedSkills, selectedBrowserIds }: LaunchAndSendPayload) => {
    const launchRes = await fetch(`${AGENTS_API}/launch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const launchData = await launchRes.json();
    const session = launchData.session as AgentSession;

    await fetch(`${AGENTS_API}/sessions/${session.id}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mode, model, provider, images, context_paths: contextPaths, forced_tools: forcedTools, attached_skills: attachedSkills, selected_browser_ids: selectedBrowserIds }),
    });

    const refreshRes = await fetch(`${AGENTS_API}/sessions/${session.id}`);
    const updatedSession = await refreshRes.json() as AgentSession;

    return { draftId, session: updatedSession };
  }
);

export const generateTitle = createAsyncThunk(
  'agents/generateTitle',
  async ({ sessionId, prompt }: { sessionId: string; prompt: string }) => {
    const res = await fetch(`${AGENTS_API}/sessions/${sessionId}/generate-title`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return { sessionId, title: data.title as string };
  }
);

export const generateGroupMeta = createAsyncThunk(
  'agents/generateGroupMeta',
  async ({ sessionId, groupId, toolCalls, resultsSummary, isRefinement }: GenerateGroupMetaPayload) => {
    const res = await fetch(`${AGENTS_API}/sessions/${sessionId}/generate-group-meta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: groupId,
        tool_calls: toolCalls,
        results_summary: resultsSummary,
        is_refinement: isRefinement ?? false,
      }),
    });
    const data = await res.json();
    return { sessionId, groupId, name: data.name as string, svg: data.svg as string, isRefined: data.is_refined as boolean };
  }
);

export const updateSystemPrompt = createAsyncThunk(
  'agents/updateSystemPrompt',
  async ({ sessionId, systemPrompt }: { sessionId: string; systemPrompt: string }) => {
    await fetch(`${AGENTS_API}/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_prompt: systemPrompt }),
    });
    return { sessionId, systemPrompt };
  }
);

export const handleApproval = createAsyncThunk(
  'agents/handleApproval',
  async ({ requestId, behavior, message, updatedInput }: {
    requestId: string; behavior: 'allow' | 'deny'; message?: string; updatedInput?: Record<string, any>;
  }) => {
    const res = await fetch(`${AGENTS_API}/approval`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId, behavior, message, updated_input: updatedInput }),
    });
    if (!res.ok) throw new Error(`Approval request failed (${res.status})`);
    return { requestId, behavior };
  }
);

export const closeSession = createAsyncThunk('agents/closeSession', async ({ sessionId }: { sessionId: string }) => {
  await fetch(`${AGENTS_API}/sessions/${sessionId}/close`, { method: 'POST' });
  return sessionId;
});

export const duplicateSession = createAsyncThunk(
  'agents/duplicateSession',
  async ({ sessionId, dashboardId, upToMessageId }: { sessionId: string; dashboardId?: string; upToMessageId?: string }) => {
    const res = await fetch(`${AGENTS_API}/sessions/${sessionId}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dashboard_id: dashboardId, up_to_message_id: upToMessageId }),
    });
    if (!res.ok) throw new Error('Failed to duplicate session');
    const data = await res.json();
    return data.session as AgentSession;
  }
);

export const deleteSession = createAsyncThunk('agents/deleteSession', async ({ sessionId }: { sessionId: string }) => {
  await fetch(`${AGENTS_API}/sessions/${sessionId}`, { method: 'DELETE' });
  return sessionId;
});

export const fetchHistory = createAsyncThunk(
  'agents/fetchHistory',
  async ({ dashboardId }: { dashboardId?: string } = {}) => {
    const params = new URLSearchParams({ limit: '10000' });
    if (dashboardId) params.set('dashboard_id', dashboardId);
    const res = await fetch(`${AGENTS_API}/history?${params}`);
    const data = await res.json();
    return data.sessions as HistorySession[];
  },
);

export const searchHistory = createAsyncThunk(
  'agents/searchHistory',
  async ({ q = '', limit = 20, offset = 0, dashboardId }: SearchHistoryParams) => {
    const params = new URLSearchParams({ q, limit: String(limit), offset: String(offset) });
    if (dashboardId) params.set('dashboard_id', dashboardId);
    const res = await fetch(`${AGENTS_API}/history?${params}`);
    const data = await res.json();
    return {
      sessions: data.sessions as HistorySession[],
      total: data.total as number,
      hasMore: data.has_more as boolean,
      query: q,
      offset,
    };
  }
);

export const resumeSession = createAsyncThunk(
  'agents/resumeSession',
  async ({ sessionId }: { sessionId: string }) => {
    const res = await fetch(`${AGENTS_API}/sessions/${sessionId}/resume`, { method: 'POST' });
    const data = await res.json();
    return data.session as AgentSession;
  }
);

export const fetchBrowserAgentChildren = createAsyncThunk(
  'agents/fetchBrowserAgentChildren',
  async (parentSessionId: string) => {
    const res = await fetch(`${AGENTS_API}/sessions/${parentSessionId}/browser-agents`);
    const data = await res.json();
    return data.sessions as AgentSession[];
  }
);
