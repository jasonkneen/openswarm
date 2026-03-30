import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { SkillForm } from './skillsTypes';

interface SkillFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingId: string | null;
  form: SkillForm;
  onFormChange: (form: SkillForm) => void;
  onSave: () => void;
}

const SkillFormDialog: React.FC<SkillFormDialogProps> = ({
  open, onClose, editingId, form, onFormChange, onSave,
}) => {
  const c = useClaudeTokens();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { bgcolor: c.bg.surface, backgroundImage: 'none', borderRadius: `${c.radius.lg}px`, border: `${c.border.width} solid ${c.border.subtle}`, boxShadow: c.shadow.lg },
      }}
    >
      <DialogTitle sx={{ color: c.text.primary, fontWeight: 600, fontFamily: c.font.sans }}>
        {editingId ? 'Edit Skill' : 'New Skill'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => onFormChange({ ...form, name: e.target.value })}
          fullWidth
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.secondary } }}
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => onFormChange({ ...form, description: e.target.value })}
          fullWidth
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.secondary } }}
        />
        <TextField
          label="Command (slash command name)"
          value={form.command}
          onChange={(e) => onFormChange({ ...form, command: e.target.value })}
          fullWidth
          size="small"
          placeholder="e.g. my-skill"
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.secondary } }}
        />
        <TextField
          label="Content (Markdown)"
          value={form.content}
          onChange={(e) => onFormChange({ ...form, content: e.target.value })}
          fullWidth
          multiline
          minRows={12}
          maxRows={24}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: c.bg.secondary, fontFamily: c.font.mono, fontSize: '0.85rem',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: c.text.tertiary, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!form.name || !form.content}
          sx={{
            bgcolor: c.accent.primary, '&:hover': { bgcolor: c.accent.pressed },
            textTransform: 'none', borderRadius: `${c.radius.md}px`,
          }}
        >
          {editingId ? 'Save Changes' : 'Create Skill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SkillFormDialog;
