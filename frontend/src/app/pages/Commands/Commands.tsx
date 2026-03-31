import React from 'react';
import Box from '@mui/material/Box';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { useCommands } from './hooks/useCommands';
import SlashCommandsSection from './SlashCommandsSection';
import AtCommandsSection from './AtCommandsSection';
import ShortcutsSection from './ShortcutsSection';

export const CommandsContent: React.FC = () => {
  const c = useClaudeTokens();
  const { slashCommands, atCommands, modesMap, navShortcuts, actionShortcuts } = useCommands();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SlashCommandsSection slashCommands={slashCommands} modesMap={modesMap} c={c} />
      <Box sx={{ my: 2, borderTop: `1px solid ${c.border.subtle}` }} />
      <AtCommandsSection atCommands={atCommands} c={c} />
      <Box sx={{ my: 2, borderTop: `1px solid ${c.border.subtle}` }} />
      <ShortcutsSection navShortcuts={navShortcuts} actionShortcuts={actionShortcuts} c={c} />
    </Box>
  );
};
