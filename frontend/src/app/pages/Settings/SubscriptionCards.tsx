import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { API_BASE } from '@/shared/config';

const SUBSCRIPTION_PROVIDERS = [
  { id: 'claude', name: 'Claude Pro / Max', desc: 'Sonnet, Opus, Haiku — use your Anthropic subscription', color: '#E8927A', preview: false },
  { id: 'gemini-cli', name: 'Gemini Advanced', desc: 'Gemini 2.5 Pro and Flash — use your Google subscription', color: '#4285F4', preview: true },
  { id: 'codex', name: 'ChatGPT Plus / Pro', desc: 'GPT-5.4, o3, o4-mini — use your OpenAI subscription', color: '#74AA9C', preview: true },
  { id: 'github', name: 'GitHub Copilot', desc: 'Claude + GPT models via your Copilot subscription', color: '#8B949E', preview: true },
];

const SubscriptionCard: React.FC<{ provider: typeof SUBSCRIPTION_PROVIDERS[0]; connected: boolean; onConnect: () => void; onDisconnect: () => void; connecting: boolean; userCode?: string; disconnecting?: boolean }> = ({ provider, connected, onConnect, onDisconnect, connecting, userCode, disconnecting }) => {
  const c = useClaudeTokens();
  const isPreview = (provider as any).preview;
  return (
    <Box sx={{
      p: 1.5, borderRadius: `${c.radius.md}px`,
      border: `1px solid ${connected ? c.status.success + '30' : connecting ? c.accent.primary + '30' : c.border.subtle}`,
      bgcolor: connected ? `${c.status.success}04` : connecting ? `${c.accent.primary}04` : 'transparent',
      opacity: isPreview ? 0.5 : 1,
      transition: 'all 0.3s ease',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            bgcolor: connected ? c.status.success : connecting ? c.accent.primary : c.border.medium,
            transition: 'background-color 0.3s ease',
            ...(connecting ? {
              animation: 'pulse-dot 1.5s ease-in-out infinite',
              '@keyframes pulse-dot': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.4, transform: 'scale(0.8)' },
              },
            } : {}),
          }} />
          <Box>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: c.text.primary }}>{provider.name}</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: connecting ? c.accent.primary : c.text.muted, transition: 'color 0.3s ease' }}>
              {connecting ? 'Waiting for authorization...' : provider.desc}
            </Typography>
          </Box>
        </Box>
        {isPreview ? (
          <Typography sx={{ fontSize: '0.65rem', color: c.text.ghost, fontStyle: 'italic' }}>
            Coming soon
          </Typography>
        ) : connected ? (
          disconnecting ? (
            <CircularProgress size={14} sx={{ color: c.text.ghost }} />
          ) : (
            <Typography onClick={onDisconnect} sx={{ fontSize: '0.68rem', color: c.text.tertiary, cursor: 'pointer', '&:hover': { color: c.status.error }, transition: 'color 0.2s ease' }}>
              Disconnect
            </Typography>
          )
        ) : connecting && userCode ? (
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.68rem', color: c.text.muted }}>Enter code:</Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: c.accent.primary, fontFamily: 'monospace', letterSpacing: '0.1em' }}>{userCode}</Typography>
          </Box>
        ) : connecting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <CircularProgress size={14} sx={{ color: c.accent.primary }} />
            <Typography sx={{ fontSize: '0.68rem', color: c.accent.primary }}>Connecting...</Typography>
          </Box>
        ) : (
          <Button onClick={onConnect} variant="outlined" size="small" sx={{ textTransform: 'none', fontSize: '0.7rem', color: c.text.primary, borderColor: c.border.medium, minWidth: 70, '&:hover': { borderColor: c.accent.primary }, transition: 'all 0.2s ease' }}>
            Connect
          </Button>
        )}
      </Box>
    </Box>
  );
};

const SubscriptionCards: React.FC = () => {
  const c = useClaudeTokens();
  const [status, setStatus] = useState<any>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [userCode, setUserCode] = useState('');
  const [pollTimer, setPollTimer] = useState<any>(null);
  const fetchStatus = () => {
    fetch(`${API_BASE}/subscriptions/status`)
      .then(r => r.json())
      .then(setStatus)
      .catch(() => setStatus({ running: false, providers: [], models: [] }));
  };
  useEffect(() => { fetchStatus(); }, []);
  const isConnected = (providerId: string) => {
    if (!status?.providers) return false;
    const connections = status.providers?.connections || (Array.isArray(status.providers) ? status.providers : []);
    return connections.some((p: any) => p.provider === providerId && p.isActive);
  };
  const handleConnect = async (providerId: string) => {
    if (pollTimer) { clearInterval(pollTimer); setPollTimer(null); }
    setConnecting(providerId);
    setUserCode('');
    await new Promise(r => setTimeout(r, 500));
    try {
      const r = await fetch(`${API_BASE}/subscriptions/connect`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId }),
      });
      if (!r.ok) { setConnecting(null); return; }
      const data = await r.json();
      if (data.flow === 'device_code') {
        const code = data.user_code || '';
        setUserCode(code);
        if (data.verification_uri) window.open(data.verification_uri, '_blank');
        const timer = setInterval(async () => {
          try {
            const pr = await fetch(`${API_BASE}/subscriptions/poll`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ provider: providerId, device_code: data.device_code, code_verifier: data.code_verifier, extra_data: data.extra_data }),
            });
            const pd = await pr.json();
            if (pd.success) {
              clearInterval(timer);
              setPollTimer(null);
              setConnecting(null);
              setUserCode('');
              fetchStatus();
            }
          } catch {}
        }, 5000);
        setPollTimer(timer);
        setTimeout(() => { clearInterval(timer); setPollTimer(null); setConnecting(null); setUserCode(''); }, 300000);
      } else if (data.flow === 'authorization_code') {
        const popup = window.open(data.auth_url, 'oauth_connect', 'width=600,height=700');
        const statusPoller = setInterval(async () => {
          try {
            const sr = await fetch(`${API_BASE}/subscriptions/status`);
            const sd = await sr.json();
            const connections = sd.providers?.connections || [];
            if (connections.some((p: any) => p.provider === providerId && p.isActive)) {
              clearInterval(statusPoller);
              setPollTimer(null);
              window.removeEventListener('message', msgHandler);
              setConnecting(null);
              fetchStatus();
            }
          } catch {}
        }, 2000);
        setPollTimer(statusPoller);
        const msgHandler = async (event: MessageEvent) => {
          const d = event.data;
          const callbackData = d?.type === 'oauth_callback' ? d.data : d;
          if (callbackData?.code) {
            window.removeEventListener('message', msgHandler);
            clearInterval(statusPoller);
            setPollTimer(null);
            if (popup && !popup.closed) popup.close();
            try {
              await fetch(`${API_BASE}/subscriptions/exchange`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  provider: providerId, code: callbackData.code,
                  redirect_uri: data.redirect_uri, code_verifier: data.code_verifier,
                  state: callbackData.state || data.state,
                }),
              });
            } catch {}
            setConnecting(null);
            fetchStatus();
          }
        };
        window.addEventListener('message', msgHandler);
        setTimeout(() => {
          clearInterval(statusPoller);
          setPollTimer(null);
          window.removeEventListener('message', msgHandler);
          setConnecting(null);
        }, 30000);
      } else {
        setConnecting(null);
      }
    } catch { setConnecting(null); }
  };
  const handleDisconnect = async (providerId: string) => {
    setDisconnecting(providerId);
    try {
      await fetch(`${API_BASE}/subscriptions/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId }),
      });
    } catch {}
    setTimeout(() => { fetchStatus(); setDisconnecting(null); }, 500);
  };
  if (!status) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {SUBSCRIPTION_PROVIDERS.map(p => (
          <Box key={p.id} sx={{
            p: 1.5, borderRadius: `${c.radius.md}px`, border: `1px solid ${c.border.subtle}`,
            display: 'flex', alignItems: 'center', gap: 1,
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
            '@keyframes skeleton-pulse': { '0%, 100%': { opacity: 0.5 }, '50%': { opacity: 0.25 } },
          }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.border.medium, flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ width: 100, height: 12, bgcolor: c.border.subtle, borderRadius: 1, mb: 0.5 }} />
              <Box sx={{ width: 180, height: 10, bgcolor: c.border.subtle, borderRadius: 1 }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
  if (!status?.running) {
    return (
      <Box sx={{ p: 2, borderRadius: `${c.radius.md}px`, border: `1px solid ${c.border.subtle}`, textAlign: 'center' }}>
        <CircularProgress size={18} sx={{ color: c.text.ghost, mb: 1 }} />
        <Typography sx={{ fontSize: '0.78rem', color: c.text.muted, mb: 0.5 }}>
          Starting subscription service...
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: c.text.ghost }}>
          This connects your existing AI subscriptions. If this doesn't load, make sure Node.js is installed.
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {SUBSCRIPTION_PROVIDERS.map(p => (
        <SubscriptionCard
          key={p.id}
          provider={p}
          connected={isConnected(p.id)}
          onConnect={() => handleConnect(p.id)}
          onDisconnect={() => handleDisconnect(p.id)}
          connecting={connecting === p.id}
          disconnecting={disconnecting === p.id}
          userCode={connecting === p.id ? userCode : undefined}
        />
      ))}
    </Box>
  );
};

export default SubscriptionCards;
