import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { fetchTemplates } from '@/shared/state/templatesSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { useTemplateEditor } from './useTemplateEditor';
import TemplateCard from './TemplateCard';
import TemplateEditorDialog from './TemplateEditorDialog';

const Templates: React.FC = () => {
  const c = useClaudeTokens();
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.templates);
  const templates = Object.values(items);
  const te = useTemplateEditor();

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: c.text.primary, fontWeight: 700, mb: 0.5 }}>
            Prompt Templates
          </Typography>
          <Typography sx={{ color: c.text.tertiary, fontSize: '0.85rem' }}>
            Create and manage reusable prompt templates with structured input fields.
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={te.openNew}
          sx={{
            bgcolor: c.accent.primary,
            '&:hover': { bgcolor: c.accent.pressed },
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          New Template
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: c.accent.primary }} />
        </Box>
      ) : templates.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            color: c.text.ghost,
          }}
        >
          <Typography sx={{ fontSize: '1.1rem', mb: 1 }}>No templates yet</Typography>
          <Typography sx={{ fontSize: '0.85rem' }}>Click "New Template" to get started.</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 2,
          }}
        >
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} onEdit={te.openEdit} onDelete={te.handleDelete} />
          ))}
        </Box>
      )}

      <TemplateEditorDialog
        open={te.editorOpen}
        onClose={() => te.setEditorOpen(false)}
        editingId={te.editingId}
        editor={te.editor}
        setEditor={te.setEditor}
        tagInput={te.tagInput}
        setTagInput={te.setTagInput}
        onSave={te.handleSave}
        addField={te.addField}
        updateField={te.updateField}
        removeField={te.removeField}
        addTag={te.addTag}
        removeTag={te.removeTag}
      />
    </Box>
  );
};

export default Templates;
