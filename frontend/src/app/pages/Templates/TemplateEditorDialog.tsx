import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { TemplateField } from '@/shared/state/templatesSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { EditorState } from './useTemplateEditor';

const FIELD_TYPES = ['str', 'int', 'float', 'select', 'multi-select', 'literal'] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  editingId: string | null;
  editor: EditorState;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
  tagInput: string;
  setTagInput: (v: string) => void;
  onSave: () => void;
  addField: () => void;
  updateField: (idx: number, patch: Partial<TemplateField>) => void;
  removeField: (idx: number) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

const TemplateEditorDialog: React.FC<Props> = ({
  open, onClose, editingId, editor, setEditor,
  tagInput, setTagInput, onSave,
  addField, updateField, removeField, addTag, removeTag,
}) => {
  const c = useClaudeTokens();

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: c.text.primary,
      '& fieldset': { borderColor: c.border.strong },
      '&:hover fieldset': { borderColor: c.text.tertiary },
      '&.Mui-focused fieldset': { borderColor: c.accent.primary },
    },
    '& .MuiInputLabel-root': { color: c.text.tertiary },
    '& .MuiInputLabel-root.Mui-focused': { color: c.accent.primary },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: c.bg.surface,
          color: c.text.primary,
          borderRadius: 4,
          border: `1px solid ${c.border.subtle}`,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ color: c.text.primary, fontWeight: 600 }}>
        {editingId ? 'Edit Template' : 'New Template'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          label="Name"
          value={editor.name}
          onChange={(e) => setEditor((p) => ({ ...p, name: e.target.value }))}
          fullWidth
          size="small"
          sx={inputSx}
        />
        <TextField
          label="Description"
          value={editor.description}
          onChange={(e) => setEditor((p) => ({ ...p, description: e.target.value }))}
          fullWidth
          size="small"
          multiline
          rows={2}
          sx={inputSx}
        />
        <TextField
          label="Template (use {{field_name}} for placeholders)"
          value={editor.template}
          onChange={(e) => setEditor((p) => ({ ...p, template: e.target.value }))}
          fullWidth
          size="small"
          multiline
          rows={5}
          sx={{
            ...inputSx,
            '& .MuiOutlinedInput-root': {
              ...inputSx['& .MuiOutlinedInput-root'],
              fontFamily: c.font.mono,
              fontSize: '0.85rem',
            },
          }}
        />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: c.text.muted, fontSize: '0.85rem', fontWeight: 600 }}>
              Fields
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addField}
              sx={{ color: c.accent.primary, textTransform: 'none', fontSize: '0.8rem' }}
            >
              Add Field
            </Button>
          </Box>
          {editor.fields.map((field, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                gap: 1,
                mb: 1,
                alignItems: 'flex-start',
                bgcolor: c.bg.elevated,
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${c.border.subtle}`,
              }}
            >
              <TextField
                label="Field name"
                value={field.name}
                onChange={(e) => updateField(idx, { name: e.target.value })}
                size="small"
                sx={{ ...inputSx, flex: 1 }}
              />
              <TextField
                select
                label="Type"
                value={field.type}
                onChange={(e) => updateField(idx, { type: e.target.value as TemplateField['type'] })}
                size="small"
                sx={{ ...inputSx, minWidth: 130 }}
                SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: c.bg.surface, color: c.text.primary } } } }}
              >
                {FIELD_TYPES.map((ft) => (
                  <MenuItem key={ft} value={ft}>{ft}</MenuItem>
                ))}
              </TextField>
              {(field.type === 'select' || field.type === 'multi-select') && (
                <TextField
                  label="Options (comma-sep)"
                  value={(field.options || []).join(', ')}
                  onChange={(e) =>
                    updateField(idx, {
                      options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  size="small"
                  sx={{ ...inputSx, flex: 1 }}
                />
              )}
              <TextField
                label="Default"
                value={field.default ?? ''}
                onChange={(e) => updateField(idx, { default: e.target.value || undefined })}
                size="small"
                sx={{ ...inputSx, flex: 0.7 }}
              />
              <IconButton
                onClick={() => removeField(idx)}
                sx={{ color: c.text.tertiary, mt: 0.5, '&:hover': { color: c.status.error } }}
              >
                <RemoveCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Box>
          <Typography sx={{ color: c.text.muted, fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {editor.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onDelete={() => removeTag(tag)}
                sx={{
                  bgcolor: c.bg.secondary,
                  color: c.text.muted,
                  '& .MuiChip-deleteIcon': { color: c.text.tertiary, '&:hover': { color: c.status.error } },
                }}
              />
            ))}
            <TextField
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              size="small"
              sx={{ ...inputSx, width: 140 }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: c.text.tertiary }}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!editor.name.trim() || !editor.template.trim()}
          sx={{
            bgcolor: c.accent.primary,
            '&:hover': { bgcolor: c.accent.pressed },
            '&.Mui-disabled': { bgcolor: c.bg.secondary, color: c.text.ghost },
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {editingId ? 'Save Changes' : 'Create Template'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateEditorDialog;
