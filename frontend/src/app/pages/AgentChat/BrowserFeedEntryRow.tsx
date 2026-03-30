import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import type { FeedEntry, FeedColors } from './browserFeedUtils';
import { getActionIcon } from './browserFeedUtils';

export const EntryRow: React.FC<{ entry: FeedEntry; accentColor: string; fc: FeedColors }> = ({ entry, accentColor, fc }) => {
  const c = useClaudeTokens();

  if (entry.type === 'thought') {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-start', minWidth: 0 }}>
        <SmartToyOutlinedIcon
          sx={{ fontSize: 10, color: fc.thoughtIcon, mt: '3px', flexShrink: 0 }}
        />
        <Typography
          sx={{
            fontSize: '0.7rem',
            color: fc.thought,
            lineHeight: 1.45,
            wordBreak: 'break-word',
            fontFamily: c.font.mono,
          }}
        >
          {entry.text}
        </Typography>
      </Box>
    );
  }

  if (entry.type === 'action') {
    const ActionIcon = getActionIcon(entry.actionTool);
    return (
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-start', minWidth: 0 }}>
        <ActionIcon sx={{ fontSize: 11, color: accentColor, mt: '2px', flexShrink: 0 }} />
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontFamily: c.font.mono,
            color: accentColor,
            lineHeight: 1.45,
            wordBreak: 'break-word',
          }}
        >
          {entry.text}
        </Typography>
      </Box>
    );
  }

  if (entry.type === 'result') {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-start', minWidth: 0, pl: 1.25 }}>
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontFamily: c.font.mono,
            color: fc.result,
            lineHeight: 1.45,
            wordBreak: 'break-word',
          }}
        >
          ↳ {entry.text}
        </Typography>
      </Box>
    );
  }

  if (entry.type === 'system') {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', minWidth: 0 }}>
        <ErrorOutlineIcon sx={{ fontSize: 10, color: fc.errorIcon, flexShrink: 0 }} />
        <Typography
          sx={{
            fontSize: '0.68rem',
            fontFamily: c.font.mono,
            color: fc.error,
            lineHeight: 1.45,
          }}
        >
          {entry.text}
        </Typography>
      </Box>
    );
  }

  return null;
};

export const SessionStatusChip: React.FC<{ status: string }> = ({ status }) => {
  const c = useClaudeTokens();
  if (status === 'running') {
    return (
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: c.status.success,
          animation: 'ba-feed-pulse 1.4s ease-in-out infinite',
          '@keyframes ba-feed-pulse': {
            '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
            '50%': { opacity: 1, transform: 'scale(1.2)' },
          },
        }}
      />
    );
  }
  if (status === 'completed') {
    return <CheckCircleOutlineIcon sx={{ fontSize: 10, color: c.status.success }} />;
  }
  if (status === 'error') {
    return <ErrorOutlineIcon sx={{ fontSize: 10, color: c.status.error }} />;
  }
  return null;
};
