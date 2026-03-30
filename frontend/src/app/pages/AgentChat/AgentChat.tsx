import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AssistantRuntimeProvider, useAui, Tools } from '@assistant-ui/react';
import { AgentMessage, editMessage, switchBranch, duplicateSession, setActiveSession } from '@/shared/state/agentsSlice';
import MessageBubble from './MessageBubble';
import MessageActionBar from './MessageActionBar';
import ToolCallBubble from './ToolCallBubble';
import ToolGroupBubble, { isToolGroup, isToolPair } from './ToolGroupBubble';
import ApprovalBar, { BatchApprovalBar } from './ApprovalBar';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import MessageQueue from './MessageQueue';
import StreamingSection from './StreamingSection';
import { useAgentChat } from './hooks/useAgentChat';
import { useMessageRendering } from './hooks/useMessageRendering';
import { useOpenSwarmRuntime } from './runtime/useOpenSwarmRuntime';
import { toolkit } from './toolkit';
import { ContextPath } from '@/app/components/DirectoryBrowser';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

interface AgentChatProps {
  sessionId?: string;
  onClose?: () => void;
  embedded?: boolean;
  autoFocus?: boolean;
  isGlowing?: boolean;
  onDismissGlow?: () => void;
  initialContextPaths?: ContextPath[];
  onBranch?: (newSessionId: string) => void;
}

const AgentChat: React.FC<AgentChatProps> = ({ sessionId, onClose, embedded, autoFocus, isGlowing, onDismissGlow, initialContextPaths, onBranch }) => {
  const c = useClaudeTokens();
  const {
    id, session, isDraft, dispatch, mode, model,
    scrollContainerRef, chatInputRef, messageQueueRef,
    showScrollButton, showResumeBubble, awaitingResponse, editingMessageId,
    queueLength, setQueueLength, agentBusy,
    handleScroll, scrollToBottom, handleSend,
    handleModeChange, handleModelChange,
    handleApprove, handleDeny, handleStop, handleResume,
    handleSaveEdit, handleCancelEdit, setEditingMessageId,
  } = useAgentChat({ sessionId, initialContextPaths });

  const runtime = useOpenSwarmRuntime(id);
  const aui = useAui({ tools: Tools({ toolkit }) });

  const { activeBranchMessages, renderItems, lastAssistantIdsInTurn, getSiblingBranches, contextEstimate } = useMessageRendering(session, model, id, isDraft);

  const handleRegenerate = useCallback(
    (assistantMsg: AgentMessage) => {
      if (!id) return;
      const idx = activeBranchMessages.findIndex((m) => m.id === assistantMsg.id);
      for (let i = idx - 1; i >= 0; i--) {
        if (activeBranchMessages[i].role === 'user') {
          const userMsg = activeBranchMessages[i];
          const content = typeof userMsg.content === 'string' ? userMsg.content : JSON.stringify(userMsg.content);
          dispatch(editMessage({ sessionId: id, messageId: userMsg.id, content }));
          break;
        }
      }
    },
    [id, activeBranchMessages, dispatch]
  );

  const handleBranchChat = useCallback(async (upToMessageId: string) => {
    if (!id) return;
    const dashId = session?.dashboard_id;
    const action = await dispatch(duplicateSession({ sessionId: id, dashboardId: dashId, upToMessageId }));
    if (duplicateSession.fulfilled.match(action)) {
      if (onBranch) onBranch(action.payload.id);
      else dispatch(setActiveSession(action.payload.id));
    }
  }, [id, dispatch, onBranch, session?.dashboard_id]);

  if (!session) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
        <Typography sx={{ color: c.text.tertiary, fontSize: '1rem' }}>Session not found</Typography>
      </Box>
    );
  }
  const sessionRunning = session.status === 'running' || session.status === 'waiting_approval';

  return (
    <AssistantRuntimeProvider runtime={runtime} aui={aui}>
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {!embedded && <ChatHeader session={session} isDraft={isDraft} id={id} onClose={onClose} />}
        <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <Box
            ref={scrollContainerRef}
            onScroll={handleScroll}
            sx={{
              height: '100%', overflow: 'auto', px: 2, py: 1,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: c.border.medium, borderRadius: 3,
                '&:hover': { background: c.border.strong },
              },
              scrollbarWidth: 'thin', scrollbarColor: `${c.border.medium} transparent`,
            }}
          >
            {renderItems.map((item) => {
              if (isToolGroup(item)) {
                const groupMeta = session.tool_group_meta?.[item.id];
                return <ToolGroupBubble key={item.id} group={item} isSessionRunning={sessionRunning} meta={groupMeta} sessionId={session.id} />;
              }
              if (isToolPair(item)) {
                const isPending = item.result === null && sessionRunning;
                return <ToolCallBubble key={item.id} call={item.call} result={item.result} isPending={isPending} sessionId={session.id} />;
              }
              const msg = item;
              const isEditing = editingMessageId === msg.id;
              const siblings = getSiblingBranches(msg.id);
              const hasBranches = siblings.length > 0;
              const currentBranchIdx = hasBranches ? siblings.indexOf(session.active_branch_id || 'main') : 0;
              const rawText = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
              return (
                <Box key={msg.id} sx={{ '&:hover .msg-actions': { opacity: 1 } }}>
                  <MessageBubble message={msg} editing={isEditing} onSaveEdit={handleSaveEdit} onCancelEdit={handleCancelEdit} />
                  {!isEditing && (msg.role === 'user' || (msg.role === 'assistant' && lastAssistantIdsInTurn.has(msg.id))) && (
                    <MessageActionBar
                      role={msg.role as 'user' | 'assistant'}
                      onCopy={() => navigator.clipboard.writeText(rawText)}
                      onEdit={msg.role === 'user' ? () => setEditingMessageId(msg.id) : undefined}
                      onRegenerate={msg.role === 'assistant' ? () => handleRegenerate(msg) : undefined}
                      onBranch={msg.role === 'assistant' ? () => handleBranchChat(msg.id) : undefined}
                      branchNav={hasBranches ? {
                        currentIndex: Math.max(0, currentBranchIdx),
                        totalBranches: siblings.length,
                        onPrevious: () => { const b = siblings[Math.max(0, currentBranchIdx - 1)]; if (b && id) dispatch(switchBranch({ sessionId: id, branchId: b })); },
                        onNext: () => { const b = siblings[Math.min(siblings.length - 1, currentBranchIdx + 1)]; if (b && id) dispatch(switchBranch({ sessionId: id, branchId: b })); },
                      } : undefined}
                    />
                  )}
                </Box>
              );
            })}
            <StreamingSection session={session} awaitingResponse={awaitingResponse} showResumeBubble={showResumeBubble} handleResume={handleResume} />
          </Box>
          {showScrollButton && (
            <Tooltip title="Scroll to bottom">
              <IconButton
                onClick={scrollToBottom}
                sx={{
                  position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                  bgcolor: c.bg.surface, border: `1px solid ${c.border.medium}`, color: c.accent.primary,
                  width: 36, height: 36, '&:hover': { bgcolor: c.bg.secondary },
                  boxShadow: c.shadow.md, zIndex: 1,
                }}
              >
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {session.pending_approvals.length > 1 ? (
          <BatchApprovalBar requests={session.pending_approvals} onApprove={handleApprove} onDeny={handleDeny} />
        ) : (
          session.pending_approvals.map((req) => (
            <ApprovalBar key={req.id} request={req} onApprove={handleApprove} onDeny={handleDeny} />
          ))
        )}
        {isGlowing ? (
          <Box
            onClick={(e) => { e.stopPropagation(); onDismissGlow?.(); }}
            sx={{
              mx: 1.5, mb: 1.5, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 2.5, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              color: c.accent.primary, border: `1.5px solid ${c.accent.primary}`,
              background: `${c.accent.primary}08`,
              boxShadow: `0 0 12px ${c.accent.primary}25, inset 0 0 12px ${c.accent.primary}08`,
              animation: 'continue-chat-glow 2s ease-in-out infinite',
              transition: 'background 0.15s, box-shadow 0.15s',
              '@keyframes continue-chat-glow': {
                '0%, 100%': { boxShadow: `0 0 12px ${c.accent.primary}25, inset 0 0 12px ${c.accent.primary}08` },
                '50%': { boxShadow: `0 0 20px ${c.accent.primary}40, inset 0 0 20px ${c.accent.primary}15` },
              },
              '&:hover': { background: `${c.accent.primary}14`, boxShadow: `0 0 24px ${c.accent.primary}50, inset 0 0 20px ${c.accent.primary}18` },
            }}
          >
            Continue chat
          </Box>
        ) : (
          <MessageQueue messageQueueRef={messageQueueRef} queueLength={queueLength} setQueueLength={setQueueLength}>
            <ChatInput
              ref={chatInputRef}
              onSend={handleSend}
              disabled={false}
              mode={mode}
              onModeChange={handleModeChange}
              model={model}
              onModelChange={handleModelChange}
              isRunning={agentBusy}
              onStop={handleStop}
              queueLength={queueLength}
              contextEstimate={contextEstimate}
              sessionId={id}
              autoFocus={autoFocus}
            />
          </MessageQueue>
        )}
      </Box>
    </Box>
    </AssistantRuntimeProvider>
  );
};

export default AgentChat;
