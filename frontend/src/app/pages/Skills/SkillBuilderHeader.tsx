import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import type { SkillPreviewData } from './skillBuilderChatTypes';

interface SkillBuilderHeaderProps {
  currentPreview: SkillPreviewData | null;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

export const SkillBuilderHeader: React.FC<SkillBuilderHeaderProps> = ({
  currentPreview,
  saving,
  onSave,
  onReset,
  onMinimize,
  onClose,
}) => {
  const c = useClaudeTokens();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderBottom: `1px solid ${c.border.subtle}`,
        bgcolor: c.bg.secondary,
        flexShrink: 0,
        minHeight: 42,
      }}
    >
      <AutoFixHighIcon sx={{ fontSize: 18, color: c.accent.primary }} />
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: c.text.primary, flex: 1 }}>
        Skill Builder
      </Typography>

      {currentPreview && currentPreview.name && (
        <Button
          size="small"
          variant="contained"
          startIcon={<SaveIcon sx={{ fontSize: 14 }} />}
          onClick={onSave}
          disabled={saving || !currentPreview.content}
          sx={{
            bgcolor: c.accent.primary,
            '&:hover': { bgcolor: c.accent.pressed },
            textTransform: 'none',
            fontSize: '0.72rem',
            fontWeight: 600,
            px: 1.5,
            py: 0.25,
            minHeight: 28,
            borderRadius: `${c.radius.sm}px`,
            boxShadow: 'none',
          }}
        >
          {saving ? 'Saving...' : 'Save Skill'}
        </Button>
      )}

      <Tooltip title="Reset session">
        <IconButton size="small" onClick={onReset} sx={{ color: c.text.tertiary, '&:hover': { color: c.text.primary } }}>
          <RestartAltIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Minimize">
        <IconButton size="small" onClick={onMinimize} sx={{ color: c.text.tertiary, '&:hover': { color: c.text.primary } }}>
          <MinimizeIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Close">
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: c.text.tertiary, '&:hover': { color: c.status.error } }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
