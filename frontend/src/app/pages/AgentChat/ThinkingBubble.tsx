import React from 'react';
import Box from '@mui/material/Box';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

export const CONTEXT_WINDOWS: Record<string, number> = {
  sonnet: 200_000,
  opus: 200_000,
  haiku: 200_000,
};

const thinkingDotsKeyframes = `
@keyframes thinking-bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
`;

const ThinkingBubble: React.FC = () => {
  const c = useClaudeTokens();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', my: 0.75 }}>
      <style>{thinkingDotsKeyframes}</style>
      <Box
        sx={{
          bgcolor: c.bg.surface,
          border: `1px solid ${c.border.subtle}`,
          borderRadius: '16px 16px 16px 4px',
          px: 2,
          py: 1.5,
          boxShadow: c.shadow.sm,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          minHeight: 36,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: c.text.tertiary,
              animation: 'thinking-bounce 1.4s infinite ease-in-out both',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ThinkingBubble;
