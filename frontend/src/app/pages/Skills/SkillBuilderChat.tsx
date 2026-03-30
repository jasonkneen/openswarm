import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import AgentChat from '../AgentChat/AgentChat';
import { useSkillBuilderSession } from './useSkillBuilderSession';
import { SkillBuilderHeader } from './SkillBuilderHeader';
import type { SkillBuilderChatProps } from './skillBuilderChatTypes';

export type { SkillPreviewData } from './skillBuilderChatTypes';

const SkillBuilderChat: React.FC<SkillBuilderChatProps> = ({ onSkillPreview, onSkillSaved, expanded, onExpandedChange }) => {
  const c = useClaudeTokens();
  const setExpanded = onExpandedChange;

  const {
    panelWidth,
    panelHeight,
    onResizeStart,
    onResizeMove,
    onResizeEnd,
    effectiveSessionId,
    initialContextPaths,
    currentPreview,
    saving,
    handleSave,
    handleReset,
  } = useSkillBuilderSession(onSkillPreview, onSkillSaved, expanded);

  if (!expanded) {
    return (
      <Tooltip title="Build skill with AI" placement="left">
        <Fab
          onClick={() => setExpanded(true)}
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            bgcolor: c.accent.primary,
            color: '#fff',
            '&:hover': { bgcolor: c.accent.pressed },
            zIndex: 10,
            width: 52,
            height: 52,
            boxShadow: c.shadow.lg,
          }}
        >
          <AutoFixHighIcon />
        </Fab>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: panelWidth,
        height: panelHeight,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: c.bg.surface,
        border: `1px solid ${c.border.medium}`,
        borderRadius: `${c.radius.lg}px`,
        boxShadow: c.shadow.lg,
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      <Box
        onPointerDown={(e) => onResizeStart('left', e)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
        sx={{
          position: 'absolute', left: 0, top: 12, bottom: 0, width: 6,
          cursor: 'col-resize', zIndex: 2,
          '&::after': {
            content: '""', position: 'absolute',
            top: 0, bottom: 0, left: 0, width: 2,
            borderRadius: `${c.radius.lg}px 0 0 ${c.radius.lg}px`,
            bgcolor: 'transparent', transition: 'background-color 0.15s',
          },
          '&:hover::after, &:active::after': { bgcolor: c.accent.primary },
        }}
      />
      <Box
        onPointerDown={(e) => onResizeStart('top', e)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
        sx={{
          position: 'absolute', top: 0, left: 12, right: 0, height: 6,
          cursor: 'row-resize', zIndex: 2,
          '&::after': {
            content: '""', position: 'absolute',
            left: 0, right: 0, top: 0, height: 2,
            borderRadius: `${c.radius.lg}px ${c.radius.lg}px 0 0`,
            bgcolor: 'transparent', transition: 'background-color 0.15s',
          },
          '&:hover::after, &:active::after': { bgcolor: c.accent.primary },
        }}
      />
      <Box
        onPointerDown={(e) => onResizeStart('corner', e)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
        sx={{
          position: 'absolute', top: 0, left: 0, width: 14, height: 14,
          cursor: 'nwse-resize', zIndex: 3,
        }}
      />

      <SkillBuilderHeader
        currentPreview={currentPreview}
        saving={saving}
        onSave={handleSave}
        onReset={handleReset}
        onMinimize={() => setExpanded(false)}
        onClose={() => {
          setExpanded(false);
          onSkillPreview(null);
        }}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {effectiveSessionId ? (
          <AgentChat
            key={effectiveSessionId}
            sessionId={effectiveSessionId}
            embedded
            initialContextPaths={initialContextPaths}
          />
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: c.text.ghost, fontSize: '0.85rem' }}>
              Initializing skill builder...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SkillBuilderChat;
