import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import { AgentMessage } from '@/shared/state/agentsSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { SKILL_COLOR } from '@/app/components/richEditorUtils';
import { ParsedElement, SKILL_PILL_RE } from './messageBubbleUtils';
import AttachedContextSection from './AttachedContextSection';
import MessageImageThumbnails from './MessageImageThumbnails';

function renderUserTextWithPills(text: string, c: ReturnType<typeof useClaudeTokens>): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(SKILL_PILL_RE.source, 'g');
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const skillName = match[1];
    parts.push(
      <Chip
        key={`skill-${match.index}`}
        icon={<PsychologyOutlinedIcon sx={{ fontSize: 12 }} />}
        label={skillName}
        size="small"
        sx={{
          bgcolor: `${SKILL_COLOR}18`,
          color: SKILL_COLOR,
          fontSize: '0.72rem',
          fontFamily: c.font.mono,
          height: 20,
          mx: 0.25,
          verticalAlign: 'baseline',
          '& .MuiChip-icon': { color: SKILL_COLOR },
        }}
      />,
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

interface Props {
  message: AgentMessage;
  displayText: string;
  rawText: string;
  selectedElements: ParsedElement[];
  editing: boolean;
  onSaveEdit?: (messageId: string, newContent: string) => void;
  onCancelEdit?: () => void;
}

const UserBubbleContent: React.FC<Props> = ({
  message, displayText, rawText, selectedElements, editing, onSaveEdit, onCancelEdit,
}) => {
  const c = useClaudeTokens();
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (editing) setEditText(rawText);
  }, [editing, rawText]);

  const handleCancelEdit = () => {
    setEditText('');
    onCancelEdit?.();
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== rawText && onSaveEdit) {
      onSaveEdit(message.id, trimmed);
    }
    setEditText('');
    onCancelEdit?.();
  };

  if (editing) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 240 }}>
        <TextField
          multiline
          fullWidth
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          variant="outlined"
          size="small"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSaveEdit();
            }
            if (e.key === 'Escape') handleCancelEdit();
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: c.text.primary,
              fontSize: '0.875rem',
              '& fieldset': { borderColor: c.border.strong },
              '&:hover fieldset': { borderColor: c.text.tertiary },
              '&.Mui-focused fieldset': { borderColor: c.accent.primary },
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            size="small"
            onClick={handleCancelEdit}
            sx={{ color: c.text.muted, fontSize: '0.75rem' }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleSaveEdit}
            disabled={!editText.trim() || editText.trim() === rawText}
            sx={{
              bgcolor: c.accent.primary,
              fontSize: '0.75rem',
              '&:hover': { bgcolor: c.accent.hover },
            }}
          >
            Save & Submit
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {message.images && message.images.length > 0 && (
        <MessageImageThumbnails images={message.images} c={c} />
      )}
      <Typography sx={{ color: c.text.primary, fontSize: '0.875rem', lineHeight: 1.6, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
        {renderUserTextWithPills(displayText, c)}
      </Typography>
      <AttachedContextSection elements={selectedElements} message={message} c={c} />
    </Box>
  );
};

export default UserBubbleContent;
