import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import LinkIcon from '@mui/icons-material/Link';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { Integration } from './integrations';

interface CredentialsDialogProps {
  open: boolean;
  onClose: () => void;
  integration: Integration | null;
  values: Record<string, string>;
  onValuesChange: (values: Record<string, string>) => void;
  saving: boolean;
  onSave: () => void;
}

export const CredentialsDialog: React.FC<CredentialsDialogProps> = ({
  open, onClose, integration, values, onValuesChange, saving, onSave,
}) => {
  const c = useClaudeTokens();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: c.bg.surface, backgroundImage: 'none', borderRadius: 4, border: `1px solid ${c.border.subtle}` } }}>
      <DialogTitle sx={{ color: c.text.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {integration && (
          <Box sx={{ width: 32, height: 32, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${integration.color}18`, fontSize: '1rem', fontWeight: 700, color: integration.color }}>
            {integration.icon}
          </Box>
        )}
        {integration?.connectLabel || 'Connect'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        {integration?.connectInstructions && (
          <Typography sx={{ color: c.text.muted, fontSize: '0.85rem', lineHeight: 1.5, bgcolor: c.bg.secondary, px: 2, py: 1.5, borderRadius: 2, border: `1px solid ${c.border.subtle}` }}>
            {integration.connectInstructions}
          </Typography>
        )}
        {(integration?.credentialFields || []).map((field) => (
          <TextField key={field.key} label={field.label} placeholder={field.placeholder}
            value={values[field.key] || ''}
            onChange={(e) => onValuesChange({ ...values, [field.key]: e.target.value })}
            fullWidth size="small" helperText={field.helpText}
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.page, fontFamily: c.font.mono, fontSize: '0.85rem' } }} />
        ))}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: c.text.tertiary, textTransform: 'none' }}>Cancel</Button>
        <Button variant="contained" onClick={onSave}
          disabled={saving || (integration?.credentialFields || []).some((f) => !f.optional && !values[f.key]?.trim())}
          startIcon={saving ? <CircularProgress size={14} /> : <LinkIcon sx={{ fontSize: 14 }} />}
          sx={{ bgcolor: integration?.color || c.accent.primary, '&:hover': { bgcolor: integration?.color || c.accent.pressed, filter: 'brightness(0.9)' }, textTransform: 'none', borderRadius: 2 }}>
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};
