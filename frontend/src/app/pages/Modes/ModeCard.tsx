import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Mode } from '@/shared/state/modesSlice';
import { ICON_MAP } from './modesConstants';

interface ModeCardProps {
  mode: Mode;
  items: Record<string, Mode>;
  onEdit: (mode: Mode) => void;
  onDelete: (id: string) => void;
  c: any;
}

const ModeCard: React.FC<ModeCardProps> = ({ mode, items, onEdit, onDelete, c }) => (
  <Card
    sx={{
      bgcolor: c.bg.surface,
      border: `1px solid ${c.border.subtle}`,
      borderRadius: 2,
      boxShadow: c.shadow.sm,
      '&:hover': { borderColor: mode.color, boxShadow: c.shadow.md },
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
  >
    <CardContent sx={{ pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box sx={{ color: mode.color, display: 'flex', alignItems: 'center' }}>
          {ICON_MAP[mode.icon] || ICON_MAP.smart_toy}
        </Box>
        <Typography variant="h6" sx={{ color: c.text.primary, fontWeight: 600, fontSize: '1rem', flex: 1 }}>
          {mode.name}
        </Typography>
        {mode.is_builtin && (
          <Chip
            icon={<LockIcon sx={{ fontSize: 12 }} />}
            label="Built-in"
            size="small"
            sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.7rem', height: 22 }}
          />
        )}
      </Box>
      {mode.description && (
        <Typography sx={{ color: c.text.muted, fontSize: '0.85rem', mb: 1.5 }}>
          {mode.description}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {mode.tools !== null ? (
          <Chip
            label={`${mode.tools.length} action${mode.tools.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ bgcolor: `${mode.color}18`, color: mode.color, fontSize: '0.75rem', height: 24 }}
          />
        ) : (
          <Chip
            label="All actions"
            size="small"
            sx={{ bgcolor: `${mode.color}18`, color: mode.color, fontSize: '0.75rem', height: 24 }}
          />
        )}
        {mode.system_prompt && (
          <Chip
            label="System prompt"
            size="small"
            sx={{ bgcolor: 'rgba(174,86,48,0.15)', color: c.accent.hover, fontSize: '0.75rem', height: 24 }}
          />
        )}
        {mode.default_next_mode && (
          <Chip
            icon={<ArrowForwardIcon sx={{ fontSize: 12 }} />}
            label={items[mode.default_next_mode]?.name || mode.default_next_mode}
            size="small"
            sx={{ bgcolor: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: '0.75rem', height: 24 }}
          />
        )}
        {mode.default_folder && (
          <Chip
            icon={<FolderOpenIcon sx={{ fontSize: 12 }} />}
            label={mode.default_folder.split('/').pop() || mode.default_folder}
            size="small"
            sx={{ bgcolor: 'rgba(56,189,248,0.15)', color: '#38bdf8', fontSize: '0.75rem', height: 24 }}
          />
        )}
      </Box>
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1.5 }}>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => onEdit(mode)} sx={{ color: c.text.tertiary, '&:hover': { color: c.accent.primary } }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {!mode.is_builtin && (
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => onDelete(mode.id)} sx={{ color: c.text.tertiary, '&:hover': { color: c.status.error } }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </CardActions>
  </Card>
);

export default ModeCard;
