import React from 'react';
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

const streamingCursorKeyframes = `
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

const StreamingCursor: React.FC = () => {
  const c = useClaudeTokens();
  return (
    <>
      <style>{streamingCursorKeyframes}</style>
      <span
        style={{
          display: 'inline-block',
          width: 2,
          height: '1em',
          background: c.accent.primary,
          marginLeft: 2,
          verticalAlign: 'text-bottom',
          animation: 'blink-cursor 0.8s step-end infinite',
        }}
      />
    </>
  );
};

interface Props {
  rawText: string;
  isStreaming?: boolean;
}

const AssistantBubbleContent: React.FC<Props> = ({ rawText, isStreaming }) => {
  const c = useClaudeTokens();
  return (
    <Box
      sx={{
        color: c.text.secondary,
        fontSize: '0.875rem',
        lineHeight: 1.7,
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
        '& p': { m: 0, mb: 1, '&:last-child': { mb: 0 } },
        '& pre': {
          bgcolor: c.bg.secondary,
          borderRadius: 1.5,
          p: 1.5,
          overflow: 'auto',
          fontSize: '0.8rem',
          fontFamily: c.font.mono,
          border: `1px solid ${c.border.subtle}`,
          '&::-webkit-scrollbar': { height: 5, width: 5 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: c.border.medium,
            borderRadius: 3,
            '&:hover': { background: c.border.strong },
          },
          scrollbarWidth: 'thin',
          scrollbarColor: `${c.border.medium} transparent`,
        },
        '& code': {
          bgcolor: c.bg.secondary,
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
          fontSize: '0.8rem',
          fontFamily: c.font.mono,
        },
        '& pre code': { bgcolor: 'transparent', p: 0 },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          my: 1.5,
          fontSize: '0.82rem',
          border: `1px solid ${c.border.subtle}`,
          borderRadius: 1,
          overflow: 'hidden',
        },
        '& thead': {
          bgcolor: c.bg.secondary,
        },
        '& th': {
          textAlign: 'left',
          fontWeight: 600,
          color: c.text.primary,
          px: 1.5,
          py: 0.75,
          borderBottom: `1.5px solid ${c.border.medium}`,
          whiteSpace: 'nowrap',
        },
        '& td': {
          px: 1.5,
          py: 0.6,
          borderBottom: `0.5px solid ${c.border.subtle}`,
          verticalAlign: 'top',
        },
        '& tr:last-child td': {
          borderBottom: 'none',
        },
        '& tbody tr:hover': {
          bgcolor: `${c.bg.secondary}80`,
        },
        '& ul, & ol': { pl: 2.5, mb: 1 },
        '& li': { mb: 0.25 },
        '& a': { color: c.accent.primary },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => (
            <a {...props} style={{ cursor: 'pointer' }}>{children}</a>
          ),
        }}
      >{rawText}</ReactMarkdown>
      {isStreaming && <StreamingCursor />}
    </Box>
  );
};

export default AssistantBubbleContent;
