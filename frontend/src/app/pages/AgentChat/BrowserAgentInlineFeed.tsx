import React, { useEffect, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';
import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '@/shared/hooks';
import { AgentSession, fetchBrowserAgentChildren } from '@/shared/state/agentsSlice';
import { useClaudeTokens, useThemeMode } from '@/shared/styles/ThemeContext';
import type { RootState } from '@/shared/state/store';
import { formatMessage, darkFeedColors, lightFeedColors } from './browserFeedUtils';
import type { FeedEntry } from './browserFeedUtils';
import { EntryRow, SessionStatusChip } from './BrowserFeedEntryRow';

interface Props {
  parentSessionId: string;
  browserId?: string;
}

const selectBrowserSessions = createSelector(
  [(state: RootState) => state.agents.sessions,
   (_: RootState, parentSessionId: string) => parentSessionId,
   (_: RootState, __: string, browserId?: string) => browserId],
  (sessions, parentSessionId, browserId) =>
    Object.values(sessions).filter(
      (s): s is AgentSession =>
        s.mode === 'browser-agent' &&
        s.parent_session_id === parentSessionId &&
        (!browserId || s.browser_id === browserId),
    ),
);

const BrowserAgentInlineFeed: React.FC<Props> = ({ parentSessionId, browserId }) => {
  const c = useClaudeTokens();
  const dispatch = useAppDispatch();
  const { mode } = useThemeMode();
  const fc = mode === 'dark' ? darkFeedColors : lightFeedColors;
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchedForSession = useRef<string | null>(null);

  const browserSessions = useAppSelector((state) =>
    selectBrowserSessions(state, parentSessionId, browserId),
  );

  useEffect(() => {
    if (browserSessions.length === 0 && fetchedForSession.current !== parentSessionId) {
      fetchedForSession.current = parentSessionId;
      dispatch(fetchBrowserAgentChildren(parentSessionId))
        .unwrap()
        .catch(() => { fetchedForSession.current = null; });
    }
  }, [browserSessions.length, parentSessionId, dispatch]);

  const sessionsWithEntries = useMemo(() => {
    return browserSessions.map((session) => {
      const entries: FeedEntry[] = [];
      for (const msg of session.messages) {
        const entry = formatMessage(msg);
        if (entry) entries.push(entry);
      }
      if (session.streamingMessage?.role === 'assistant' && session.streamingMessage.content) {
        entries.push({ type: 'thought', text: session.streamingMessage.content });
      }
      return { session, entries };
    });
  }, [browserSessions]);

  const totalMessages = browserSessions.reduce(
    (n, s) => n + s.messages.length + (s.streamingMessage ? 1 : 0),
    0,
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [totalMessages]);

  if (browserSessions.length === 0) return null;

  const showLabels = sessionsWithEntries.length > 1;
  const accentColor = c.accent.primary;

  return (
    <Box
      ref={scrollRef}
      sx={{
        maxHeight: 300,
        overflowY: 'auto',
        px: 1.5,
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.25,
        scrollbarWidth: 'thin',
        scrollbarColor: `${fc.scrollThumb} transparent`,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': {
          background: fc.scrollThumb,
          borderRadius: 2,
        },
      }}
    >
      {sessionsWithEntries.map(({ session, entries }, si) => (
        <Box key={session.id} sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {showLabels && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: si > 0 ? 1 : 0, mb: 0.25 }}>
              <LanguageIcon sx={{ fontSize: 12, color: accentColor, opacity: 0.7 }} />
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: accentColor,
                  opacity: 0.8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {session.browser_id || `Browser ${si + 1}`}
              </Typography>
              <SessionStatusChip status={session.status} />
            </Box>
          )}

          {!showLabels && entries.length === 0 && session.status === 'running' && (
            <Typography
              sx={{
                fontSize: '0.7rem',
                color: c.text.tertiary,
                fontStyle: 'italic',
                fontFamily: c.font.mono,
              }}
            >
              Starting browser agent...
            </Typography>
          )}

          {entries.map((entry, i) => (
            <EntryRow key={i} entry={entry} accentColor={accentColor} fc={fc} />
          ))}

          {!showLabels && session.status === 'running' && entries.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: accentColor,
                  animation: 'ba-feed-pulse 1.4s ease-in-out infinite',
                  '@keyframes ba-feed-pulse': {
                    '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default React.memo(BrowserAgentInlineFeed);
