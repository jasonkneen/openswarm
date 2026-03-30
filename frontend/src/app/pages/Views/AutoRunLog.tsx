import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AgentMessage } from '@/shared/state/agentsSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { LogEntry } from './LogEntry';

export interface AutoRunLogProps {
  messages: AgentMessage[];
  status: string | null;
  logEndRef: React.RefObject<HTMLDivElement | null>;
  c: ReturnType<typeof useClaudeTokens>;
}

export const AutoRunLog: React.FC<AutoRunLogProps> = ({ messages, status, logEndRef, c }) => {
  const isRunning = status === 'running' || status === 'waiting_approval';
  const isDone = status === 'completed' || status === 'stopped';
  const isError = status === 'error';

  return (
    <Box sx={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${c.border.subtle}`,
      borderRadius: 1,
      overflow: 'hidden',
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        bgcolor: c.bg.secondary,
        borderBottom: `1px solid ${c.border.subtle}`,
        flexShrink: 0,
      }}>
        {isRunning && <CircularProgress size={12} sx={{ color: '#f59e0b' }} />}
        {isDone && <CheckCircleOutlineIcon sx={{ fontSize: 14, color: c.accent.primary }} />}
        {isError && <ErrorOutlineIcon sx={{ fontSize: 14, color: '#ef4444' }} />}
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: c.text.muted }}>
          {isRunning ? 'Agent running…' : isDone ? 'Agent completed' : isError ? 'Agent error' : 'Execution log'}
        </Typography>
        <Typography sx={{ fontSize: '0.68rem', color: c.text.ghost, ml: 'auto' }}>
          {messages.length} messages
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', px: 1.5, py: 1 }}>
        {messages.map((msg) => (
          <LogEntry key={msg.id} msg={msg} c={c} />
        ))}
        <div ref={logEndRef} />
      </Box>
    </Box>
  );
};
