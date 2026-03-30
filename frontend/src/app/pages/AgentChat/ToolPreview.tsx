import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TerminalIcon from '@mui/icons-material/Terminal';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BuildIcon from '@mui/icons-material/Build';
import { ApprovalRequest } from '@/shared/state/agentsSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

export function getToolIcon(toolName: string) {
  switch (toolName) {
    case 'Bash': return <TerminalIcon sx={{ fontSize: '1rem' }} />;
    case 'Read': return <DescriptionIcon sx={{ fontSize: '1rem' }} />;
    case 'Write': case 'Edit': return <EditIcon sx={{ fontSize: '1rem' }} />;
    case 'Grep': case 'Glob': return <SearchIcon sx={{ fontSize: '1rem' }} />;
    case 'AskUserQuestion': return <QuestionAnswerIcon sx={{ fontSize: '1rem' }} />;
    default: return <BuildIcon sx={{ fontSize: '1rem' }} />;
  }
}

interface ToolPreviewProps {
  request: ApprovalRequest;
  tokens: ReturnType<typeof useClaudeTokens>;
}

export const CodeBlock: React.FC<{ tokens: ReturnType<typeof useClaudeTokens>; children: React.ReactNode }> = ({ tokens: c, children }) => (
  <Box
    component="pre"
    sx={{
      bgcolor: c.bg.secondary,
      borderRadius: 1.5,
      p: 1.5,
      m: 0,
      maxHeight: 150,
      overflow: 'auto',
      border: `1px solid ${c.border.subtle}`,
      color: c.text.secondary,
      fontSize: '0.75rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      fontFamily: c.font.mono,
      '&::-webkit-scrollbar': { width: 5 },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': {
        background: c.border.medium,
        borderRadius: 3,
        '&:hover': { background: c.border.strong },
      },
      scrollbarWidth: 'thin',
      scrollbarColor: `${c.border.medium} transparent`,
    }}
  >
    {children}
  </Box>
);

const ToolPreview: React.FC<ToolPreviewProps> = ({ request, tokens: c }) => {
  const { tool_name, tool_input } = request;

  switch (tool_name) {
    case 'Bash': {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {tool_input.description && (
            <Typography sx={{ color: c.text.muted, fontSize: '0.78rem' }}>
              {tool_input.description}
            </Typography>
          )}
          <CodeBlock tokens={c}>{tool_input.command || '(empty command)'}</CodeBlock>
        </Box>
      );
    }

    case 'Read':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon sx={{ fontSize: '0.9rem', color: c.text.muted }} />
          <Typography sx={{ color: c.text.secondary, fontSize: '0.8rem', fontFamily: c.font.mono }}>
            {tool_input.file_path || tool_input.path || JSON.stringify(tool_input)}
          </Typography>
        </Box>
      );

    case 'Write':
    case 'Edit': {
      const path = tool_input.file_path || tool_input.path || '';
      const content = tool_input.content || tool_input.new_content || tool_input.old_string;
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ fontSize: '0.9rem', color: c.text.muted }} />
            <Typography sx={{ color: c.text.secondary, fontSize: '0.8rem', fontFamily: c.font.mono }}>
              {path}
            </Typography>
          </Box>
          {content && <CodeBlock tokens={c}>{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</CodeBlock>}
        </Box>
      );
    }

    case 'Grep':
    case 'Glob': {
      const pattern = tool_input.pattern || tool_input.glob_pattern || tool_input.query || '';
      const path = tool_input.path || tool_input.directory || '';
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={pattern}
              size="small"
              sx={{ fontFamily: c.font.mono, fontSize: '0.75rem', bgcolor: c.bg.secondary, color: c.text.secondary, border: `1px solid ${c.border.subtle}` }}
            />
            {path && (
              <Typography sx={{ color: c.text.muted, fontSize: '0.75rem', fontFamily: c.font.mono }}>
                in {path}
              </Typography>
            )}
          </Box>
        </Box>
      );
    }

    case 'AskUserQuestion':
      return null;

    default: {
      const preview = tool_input.command || tool_input.file_path || tool_input.path || tool_input.query || null;
      if (preview) {
        return <CodeBlock tokens={c}>{preview}</CodeBlock>;
      }
      return <CodeBlock tokens={c}>{JSON.stringify(tool_input, null, 2)}</CodeBlock>;
    }
  }
};

export default ToolPreview;
