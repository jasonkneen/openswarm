import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { API_BASE } from '@/shared/config';

const CopilotAuthButton: React.FC = () => {
  const c = useClaudeTokens();
  const [status, setStatus] = useState<'idle' | 'waiting' | 'connected' | 'error'>('idle');
  const [userCode, setUserCode] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/agents/copilot/models`)
      .then(r => r.json())
      .then(d => {
        if (d.models && d.models.length > 0) setStatus('connected');
      })
      .catch(() => {});
  }, []);

  const startAuth = async () => {
    setStatus('waiting');
    setError('');
    try {
      const resp = await fetch(`${API_BASE}/agents/copilot/start-auth`, { method: 'POST' });
      const data = await resp.json();
      setUserCode(data.user_code);
      window.open(data.verification_uri, '_blank');

      const deviceCode = data.device_code;
      const poll = setInterval(async () => {
        try {
          const r = await fetch(`${API_BASE}/agents/copilot/poll-auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_code: deviceCode }),
          });
          const d = await r.json();
          if (d.status === 'connected') {
            clearInterval(poll);
            setStatus('connected');
            setUsername(d.username || '');
          }
        } catch {}
      }, 5000);

      setTimeout(() => { clearInterval(poll); if (status === 'waiting') { setStatus('error'); setError('Auth timed out'); } }, 300000);
    } catch (e: any) {
      setStatus('error');
      setError(e.message || 'Failed to start auth');
    }
  };

  const disconnect = async () => {
    await fetch(`${API_BASE}/agents/copilot/disconnect`, { method: 'POST' });
    setStatus('idle');
    setUsername('');
  };

  if (status === 'connected') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.status.success, flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.78rem', color: c.text.primary }}>
          Connected{username ? ` as @${username}` : ''}
        </Typography>
        <Typography
          onClick={disconnect}
          sx={{ fontSize: '0.72rem', color: c.text.tertiary, cursor: 'pointer', ml: 'auto', '&:hover': { color: c.status.error } }}
        >
          Disconnect
        </Typography>
      </Box>
    );
  }

  if (status === 'waiting') {
    return (
      <Box>
        <Typography sx={{ fontSize: '0.78rem', color: c.text.primary, mb: 0.5 }}>
          Enter code <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{userCode}</strong> at github.com/login/device
        </Typography>
        <Typography sx={{ fontSize: '0.68rem', color: c.text.tertiary }}>Waiting for authorization...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        onClick={startAuth}
        variant="outlined"
        size="small"
        sx={{
          textTransform: 'none',
          fontSize: '0.78rem',
          color: c.text.primary,
          borderColor: c.border.medium,
          '&:hover': { borderColor: c.accent.primary, color: c.accent.primary },
        }}
      >
        Sign in with GitHub
      </Button>
      {error && <Typography sx={{ fontSize: '0.7rem', color: c.status.error, mt: 0.5 }}>{error}</Typography>}
    </Box>
  );
};

export default CopilotAuthButton;
