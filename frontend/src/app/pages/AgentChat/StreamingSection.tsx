import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ToolCallBubble from './ToolCallBubble';
import MessageBubble from './MessageBubble';
import ThinkingBubble from './ThinkingBubble';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

interface StreamingSectionProps {
  session: any;
  awaitingResponse: boolean;
  showResumeBubble: boolean;
  handleResume: () => void;
}

const StreamingSection: React.FC<StreamingSectionProps> = ({ session, awaitingResponse, showResumeBubble, handleResume }) => {
  const c = useClaudeTokens();
  return (
    <>
      {session.streamingMessage && (
        session.streamingMessage.role === 'tool_call' ? (
          <ToolCallBubble
            key={`streaming-${session.streamingMessage.id}`}
            isStreaming
            isPending
            sessionId={session.id}
            call={{
              id: session.streamingMessage.id, role: 'tool_call',
              content: { tool: session.streamingMessage.tool_name || '', input: session.streamingMessage.content },
              timestamp: new Date().toISOString(), branch_id: session.active_branch_id || 'main', parent_id: null,
            }}
          />
        ) : (
          <MessageBubble
            key={`streaming-${session.streamingMessage.id}`}
            isStreaming
            message={{
              id: session.streamingMessage.id, role: session.streamingMessage.role,
              content: session.streamingMessage.content, timestamp: new Date().toISOString(),
              branch_id: session.active_branch_id || 'main', parent_id: null,
            }}
          />
        )
      )}
      {(awaitingResponse || (session.status === 'running' && !session.streamingMessage)) && <ThinkingBubble />}
      {showResumeBubble && session.status === 'stopped' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', my: 0.75 }}>
          <Box
            onClick={handleResume}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.75,
              borderRadius: '12px', cursor: 'pointer',
              bgcolor: `${c.accent.primary}10`, border: `1px solid ${c.accent.primary}30`,
              transition: 'all 0.15s',
              '&:hover': { bgcolor: `${c.accent.primary}1a`, border: `1px solid ${c.accent.primary}50` },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 14, color: c.accent.primary }} />
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: c.accent.primary }}>Resume Agent Response</Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default StreamingSection;
