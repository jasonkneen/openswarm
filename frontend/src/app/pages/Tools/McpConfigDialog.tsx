import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Avatar from '@mui/material/Avatar';
import ExtensionIcon from '@mui/icons-material/Extension';
import { McpServer } from '@/shared/state/mcpRegistrySlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { cleanServerName } from './toolUtils';

export interface McpConfigDialogProps {
  open: boolean;
  onClose: () => void;
  mcpConfigServer: McpServer | null;
  mcpAuthType: 'none' | 'env_vars';
  onAuthTypeChange: (type: 'none' | 'env_vars') => void;
  mcpCredentials: Record<string, string>;
  onCredentialsChange: (creds: Record<string, string>) => void;
  mcpConfigJson: string;
  onConfigJsonChange: (json: string) => void;
  mcpConfigError: string;
  onConfigErrorChange: (err: string) => void;
  onSave: () => void;
}

export const McpConfigDialog: React.FC<McpConfigDialogProps> = ({
  open, onClose, mcpConfigServer, mcpAuthType, onAuthTypeChange,
  mcpCredentials, onCredentialsChange, mcpConfigJson, onConfigJsonChange,
  mcpConfigError, onConfigErrorChange, onSave,
}) => {
  const c = useClaudeTokens();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: c.bg.surface, backgroundImage: 'none', borderRadius: 4, border: `1px solid ${c.border.subtle}` } }}>
      <DialogTitle sx={{ color: c.text.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ExtensionIcon sx={{ color: c.status.warning }} /> Configure MCP Tool
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '8px !important' }}>
        {mcpConfigServer && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: c.bg.page, borderRadius: 2, border: `1px solid ${c.border.subtle}` }}>
            <Avatar src={mcpConfigServer.iconUrl || undefined} sx={{ width: 32, height: 32, bgcolor: c.bg.secondary, fontSize: '0.8rem', fontWeight: 700, color: c.text.muted }}>
              {mcpConfigServer.iconUrl ? null : (mcpConfigServer.title || cleanServerName(mcpConfigServer.name)).charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ color: c.text.primary, fontWeight: 600, fontSize: '0.9rem' }}>{mcpConfigServer.title || cleanServerName(mcpConfigServer.name)}</Typography>
              <Typography sx={{ color: c.text.tertiary, fontSize: '0.78rem' }}>{mcpConfigServer.description}</Typography>
            </Box>
          </Box>
        )}
        <TextField label="MCP Config (JSON)" value={mcpConfigJson}
          onChange={(e) => { onConfigJsonChange(e.target.value); try { JSON.parse(e.target.value); onConfigErrorChange(''); } catch { onConfigErrorChange('Invalid JSON'); } }}
          fullWidth multiline minRows={3} maxRows={8} error={!!mcpConfigError}
          helperText={mcpConfigError || 'Transport config passed to claude_agent_sdk (type, url, command, args, etc.)'}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.page, fontFamily: c.font.mono, fontSize: '0.85rem' } }} />
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: c.text.tertiary }}>Authentication Type</InputLabel>
          <Select value={mcpAuthType} label="Authentication Type"
            onChange={(e) => { const val = e.target.value as 'none' | 'env_vars'; onAuthTypeChange(val); if (val === 'env_vars') onCredentialsChange({ API_KEY: '' }); else onCredentialsChange({}); }}
            sx={{ bgcolor: c.bg.page }}>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="env_vars">API Keys / Env Vars</MenuItem>
          </Select>
        </FormControl>
        {mcpAuthType !== 'none' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 1.5, bgcolor: c.bg.page, borderRadius: 2, border: `1px solid ${c.border.subtle}` }}>
            <Typography sx={{ color: c.text.muted, fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Environment Variables</Typography>
            {Object.entries(mcpCredentials).map(([key, val]) => (
              <TextField key={key} label={key} value={val}
                onChange={(e) => onCredentialsChange({ ...mcpCredentials, [key]: e.target.value })}
                fullWidth size="small" type={key.toLowerCase().includes('secret') ? 'password' : 'text'}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.elevated, fontFamily: c.font.mono, fontSize: '0.85rem' } }} />
            ))}
            {mcpAuthType === 'env_vars' && (
              <Button size="small" onClick={() => onCredentialsChange({ ...mcpCredentials, [`VAR_${Object.keys(mcpCredentials).length + 1}`]: '' })}
                sx={{ color: c.accent.primary, textTransform: 'none', fontSize: '0.78rem', alignSelf: 'flex-start' }}>+ Add Variable</Button>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: c.text.tertiary, textTransform: 'none' }}>Cancel</Button>
        <Button variant="contained" onClick={onSave} disabled={!!mcpConfigError} sx={{ bgcolor: c.accent.primary, '&:hover': { bgcolor: c.accent.pressed }, textTransform: 'none', borderRadius: 2 }}>Install Tool</Button>
      </DialogActions>
    </Dialog>
  );
};
