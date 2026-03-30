import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { API_BASE } from '@/shared/config';
import SubscriptionCard, { SUBSCRIPTION_PROVIDERS } from './SubscriptionCard';

const SubscriptionCards: React.FC = () => {
  const c = useClaudeTokens();
  const [status, setStatus] = useState<any>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [userCode, setUserCode] = useState('');
  const [pollTimer, setPollTimer] = useState<any>(null);
  const retryRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchStatus = () => {
    fetch(`${API_BASE}/subscriptions/status`)
      .then(r => r.json())
      .then(setStatus)
      .catch(() => setStatus({ running: false, providers: [], models: [] }));
  };
  useEffect(() => {
    fetchStatus();
    retryRef.current = setInterval(fetchStatus, 3000);
    return () => { if (retryRef.current) clearInterval(retryRef.current); };
  }, []);
  useEffect(() => {
    if (status?.running && retryRef.current) {
      clearInterval(retryRef.current);
      retryRef.current = null;
    }
  }, [status?.running]);
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
