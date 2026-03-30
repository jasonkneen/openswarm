import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { PromptTemplate } from '@/shared/state/templatesSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

interface Props {
  template: PromptTemplate;
  onEdit: (t: PromptTemplate) => void;
  onDelete: (id: string) => void;
}

const TemplateCard: React.FC<Props> = ({ template: t, onEdit, onDelete }) => {
  const c = useClaudeTokens();

  return (
    <Box
      sx={{
        bgcolor: c.bg.surface,
        border: `1px solid ${c.border.subtle}`,
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        boxShadow: c.shadow.sm,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: c.accent.primary,
          boxShadow: '0 0 0 1px rgba(174,86,48,0.15)',
        },
      }}
      onClick={() => onEdit(t)}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: c.text.primary, fontWeight: 600, fontSize: '1rem' }}>
          {t.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, ml: 1, flexShrink: 0 }}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onEdit(t); }}
            sx={{ color: c.text.tertiary, '&:hover': { color: c.accent.primary } }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
            sx={{ color: c.text.tertiary, '&:hover': { color: c.status.error } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {t.description && (
        <Typography
          sx={{
            color: c.text.tertiary,
            fontSize: '0.8rem',
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {t.description}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={`${t.fields.length} field${t.fields.length !== 1 ? 's' : ''}`}
          size="small"
          sx={{
            bgcolor: 'rgba(174,86,48,0.08)',
            color: c.accent.primary,
            fontSize: '0.7rem',
            height: 22,
          }}
        />
        {t.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              bgcolor: c.bg.secondary,
              color: c.text.muted,
              fontSize: '0.7rem',
              height: 22,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TemplateCard;
