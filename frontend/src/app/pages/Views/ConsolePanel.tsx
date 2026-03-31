import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

export interface ConsoleEntry {
  timestamp: number;
  inputData: Record<string, any>;
  stdout: string | null;
  stderr: string | null;
  backendResult: Record<string, any> | null;
  error: string | null;
  source: string;
  running?: boolean;
}

interface ConsolePanelProps {
  entry: ConsoleEntry | null;
  c: ReturnType<typeof useClaudeTokens>;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ entry, c }) => {
  const sectionSx = { mb: 2 };
  const labelBase = { fontSize: '0.7rem' as const, fontWeight: 600, fontFamily: c.font.mono, mb: 0.5 };
  const codeBoxSx = { bgcolor: '#161b22', borderRadius: 1, p: 1.5, border: '1px solid #21262d' };
  const preStyle = { fontSize: '0.72rem', fontFamily: c.font.mono, color: '#c9d1d9', whiteSpace: 'pre-wrap' as const, wordBreak: 'break-all' as const, m: 0 };

  if (!entry) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1, bgcolor: '#0d1117' }}>
        <Typography sx={{ fontFamily: c.font.mono, fontSize: '2rem', color: '#21262d', fontWeight: 700 }}>{'>_'}</Typography>
        <Typography sx={{ color: '#8b949e', fontSize: '0.82rem' }}>No execution output yet</Typography>
        <Typography sx={{ color: '#484f58', fontSize: '0.75rem' }}>Run the backend to see results here</Typography>
      </Box>
    );
  }

  if (entry.running) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1.5, bgcolor: '#0d1117' }}>
        <CircularProgress size={24} sx={{ color: '#58a6ff' }} />
        <Typography sx={{ color: '#8b949e', fontSize: '0.82rem', fontFamily: c.font.mono }}>Executing backend…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', bgcolor: '#0d1117', overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1.5, borderBottom: '1px solid #21262d' }}>
          <Typography sx={{ fontSize: '0.72rem', fontFamily: c.font.mono, color: '#8b949e' }}>
            {new Date(entry.timestamp).toLocaleTimeString()}
          </Typography>
          <Chip label={entry.source} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600, bgcolor: '#1f6feb20', color: '#58a6ff', fontFamily: c.font.mono }} />
          {entry.error && (
            <Chip label="ERROR" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#f8717120', color: '#f87171', fontFamily: c.font.mono }} />
          )}
        </Box>
        <Box sx={sectionSx}>
          <Typography sx={{ ...labelBase, color: '#60a5fa' }}>▸ Input Data</Typography>
          <Box sx={codeBoxSx}>
            <Typography component="pre" sx={preStyle}>{JSON.stringify(entry.inputData, null, 2)}</Typography>
          </Box>
        </Box>
        {entry.stdout && (
          <Box sx={sectionSx}>
            <Typography sx={{ ...labelBase, color: '#4ade80' }}>▸ stdout</Typography>
            <Box sx={codeBoxSx}><Typography component="pre" sx={preStyle}>{entry.stdout}</Typography></Box>
          </Box>
        )}
        {entry.stderr && (
          <Box sx={sectionSx}>
            <Typography sx={{ ...labelBase, color: '#fbbf24' }}>▸ stderr</Typography>
            <Box sx={codeBoxSx}><Typography component="pre" sx={preStyle}>{entry.stderr}</Typography></Box>
          </Box>
        )}
        {entry.backendResult && (
          <Box sx={sectionSx}>
            <Typography sx={{ ...labelBase, color: '#a78bfa' }}>▸ Result</Typography>
            <Box sx={codeBoxSx}>
              <Typography component="pre" sx={preStyle}>{JSON.stringify(entry.backendResult, null, 2)}</Typography>
            </Box>
          </Box>
        )}
        {entry.error && (
          <Box sx={sectionSx}>
            <Typography sx={{ ...labelBase, color: '#f87171' }}>✗ Error</Typography>
            <Box sx={{ bgcolor: '#f8717110', borderRadius: 1, p: 1.5, border: '1px solid #f8717130' }}>
              <Typography component="pre" sx={{ ...preStyle, color: '#fca5a5' }}>{entry.error}</Typography>
            </Box>
          </Box>
        )}
        {!entry.stdout && !entry.stderr && !entry.backendResult && !entry.error && (
          <Typography sx={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: c.font.mono }}>
            No backend code to execute. Only input data was sent to the app.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
