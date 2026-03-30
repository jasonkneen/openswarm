import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AgentMessage } from '@/shared/state/agentsSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

export interface LogEntryProps {
  msg: AgentMessage;
  c: ReturnType<typeof useClaudeTokens>;
}

export const LogEntry: React.FC<LogEntryProps> = ({ msg, c }) => {
  const [open, setOpen] = useState(false);

  if (msg.role === 'user') return null;

  if (msg.role === 'assistant') {
    const text = typeof msg.content === 'string'
      ? msg.content
      : Array.isArray(msg.content)
        ? msg.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
        : JSON.stringify(msg.content);
    if (!text.trim()) return null;
    return (
      <Box sx={{ mb: 0.5 }}>
        <Box
          onClick={() => setOpen(!open)}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
        >
          <ExpandMoreIcon sx={{ fontSize: 14, color: c.text.ghost, transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.15s' }} />
          <Typography sx={{ fontSize: '0.72rem', color: c.text.muted, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text.slice(0, 120)}{text.length > 120 ? '…' : ''}
          </Typography>
        </Box>
        <Collapse in={open}>
          <Typography sx={{ fontSize: '0.72rem', color: c.text.secondary, whiteSpace: 'pre-wrap', pl: 2.5, pt: 0.5, fontFamily: c.font.mono, lineHeight: 1.5 }}>
            {text}
          </Typography>
        </Collapse>
      </Box>
    );
  }

  if (msg.role === 'tool_call') {
    const tc = typeof msg.content === 'object' ? msg.content as Record<string, any> : {};
    return (
      <Box sx={{ mb: 0.5 }}>
        <Box
          onClick={() => setOpen(!open)}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
        >
          <ExpandMoreIcon sx={{ fontSize: 14, color: c.text.ghost, transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.15s' }} />
          <Chip
            label={tc.tool || 'tool'}
            size="small"
            sx={{ height: 18, fontSize: '0.68rem', fontWeight: 600, fontFamily: c.font.mono, bgcolor: c.accent.primary + '20', color: c.accent.primary }}
          />
          {tc.input && (
            <Typography sx={{ fontSize: '0.68rem', color: c.text.ghost, ml: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {JSON.stringify(tc.input).slice(0, 80)}…
            </Typography>
          )}
        </Box>
        <Collapse in={open}>
          <Box sx={{ pl: 2.5, pt: 0.5 }}>
            <Typography component="pre" sx={{ fontSize: '0.68rem', color: c.text.secondary, fontFamily: c.font.mono, whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>
              {JSON.stringify(tc.input, null, 2)}
            </Typography>
          </Box>
        </Collapse>
      </Box>
    );
  }

  if (msg.role === 'tool_result') {
    const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
    return (
      <Box sx={{ mb: 0.5 }}>
        <Box
          onClick={() => setOpen(!open)}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
        >
          <ExpandMoreIcon sx={{ fontSize: 14, color: c.text.ghost, transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.15s' }} />
          <Typography sx={{ fontSize: '0.68rem', color: c.text.ghost }}>
            result ({content.length > 60 ? `${content.length} chars` : content.slice(0, 60)})
          </Typography>
        </Box>
        <Collapse in={open}>
          <Typography component="pre" sx={{ fontSize: '0.68rem', color: c.text.secondary, fontFamily: c.font.mono, whiteSpace: 'pre-wrap', pl: 2.5, pt: 0.5, maxHeight: 200, overflow: 'auto' }}>
            {content}
          </Typography>
        </Collapse>
      </Box>
    );
  }

  if (msg.role === 'system') {
    const text = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
    return (
      <Typography sx={{ fontSize: '0.68rem', color: c.text.ghost, fontStyle: 'italic', mb: 0.5 }}>
        {text}
      </Typography>
    );
  }

  return null;
};
