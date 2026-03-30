import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { AgentMessage } from '@/shared/state/agentsSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { SKILL_COLOR } from '@/app/components/richEditorUtils';
import { ParsedElement } from './messageBubbleUtils';

interface ContextGroup {
  key: string;
  icon: React.ReactNode;
  color: string;
  label: string;
  chips: Array<{ label: string; tooltip?: string; icon: React.ReactNode }>;
}

function buildContextGroups(
  elements: ParsedElement[],
  message: AgentMessage,
): ContextGroup[] {
  const groups: ContextGroup[] = [];

  if (elements.length > 0) {
    groups.push({
      key: 'elements',
      icon: <AdsClickIcon sx={{ fontSize: 13 }} />,
      color: '#3b82f6',
      label: `${elements.length} element${elements.length > 1 ? 's' : ''} selected`,
      chips: elements.map((el) => ({
        label: el.label,
        tooltip: el.selector,
        icon: <AdsClickIcon sx={{ fontSize: 12 }} />,
      })),
    });
  }

  const contextPaths = message.context_paths;
  if (contextPaths && contextPaths.length > 0) {
    const files = contextPaths.filter((cp) => cp.type === 'file');
    const dirs = contextPaths.filter((cp) => cp.type === 'directory');
    const allPaths = [...dirs, ...files];
    const label = [
      dirs.length > 0 ? `${dirs.length} folder${dirs.length > 1 ? 's' : ''}` : '',
      files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''}` : '',
    ].filter(Boolean).join(', ') + ' attached';
    groups.push({
      key: 'paths',
      icon: <FolderOutlinedIcon sx={{ fontSize: 13 }} />,
      color: '#10b981',
      label,
      chips: allPaths.map((cp) => {
        const name = cp.path.split('/').filter(Boolean).pop() || cp.path;
        return {
          label: name,
          tooltip: cp.path,
          icon: cp.type === 'directory'
            ? <FolderOutlinedIcon sx={{ fontSize: 12 }} />
            : <InsertDriveFileOutlinedIcon sx={{ fontSize: 12 }} />,
        };
      }),
    });
  }

  const skills = message.attached_skills;
  if (skills && skills.length > 0) {
    groups.push({
      key: 'skills',
      icon: <PsychologyOutlinedIcon sx={{ fontSize: 13 }} />,
      color: SKILL_COLOR,
      label: `${skills.length} skill${skills.length > 1 ? 's' : ''}`,
      chips: skills.map((s) => ({
        label: s.name,
        icon: <PsychologyOutlinedIcon sx={{ fontSize: 12 }} />,
      })),
    });
  }

  const forcedTools = message.forced_tools;
  if (forcedTools && forcedTools.length > 0) {
    groups.push({
      key: 'tools',
      icon: <BuildOutlinedIcon sx={{ fontSize: 13 }} />,
      color: '#f59e0b',
      label: `${forcedTools.length} action${forcedTools.length > 1 ? 's' : ''} requested`,
      chips: forcedTools.map((t) => ({
        label: t,
        icon: <BuildOutlinedIcon sx={{ fontSize: 12 }} />,
      })),
    });
  }

  return groups;
}

const AttachedContextSection: React.FC<{
  elements: ParsedElement[];
  message: AgentMessage;
  c: ReturnType<typeof useClaudeTokens>;
}> = ({ elements, message, c }) => {
  const [expanded, setExpanded] = useState(false);
  const groups = useMemo(() => buildContextGroups(elements, message), [elements, message]);

  if (groups.length === 0) return null;

  return (
    <Box sx={{ mt: 1, pt: 0.75, borderTop: `1px solid ${c.border.subtle}` }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          mb: 0.5,
          '&:hover': { opacity: 0.8 },
        }}
      >
        {groups.map((g) => (
          <Box key={g.key} sx={{ color: g.color, display: 'inline-flex', alignItems: 'center' }}>
            {g.icon}
          </Box>
        ))}
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: c.text.muted }}>
          {groups.map((g) => g.label).join(' · ')}
        </Typography>
        <ExpandMoreIcon
          sx={{
            fontSize: 14,
            color: c.text.tertiary,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: '0.15s',
          }}
        />
      </Box>
      <Collapse in={expanded}>
        {groups.map((g) => (
          <Box key={g.key} sx={{ mt: 0.5 }}>
            <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: g.color, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.25 }}>
              {g.label}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {g.chips.map((chip, i) => (
                <Tooltip key={i} title={chip.tooltip || chip.label} arrow placement="top"
                  slotProps={{ tooltip: { sx: { fontFamily: c.font.mono, fontSize: '0.68rem', maxWidth: 400 } } }}
                >
                  <Chip
                    icon={chip.icon as React.ReactElement}
                    label={chip.label}
                    size="small"
                    sx={{
                      bgcolor: `${g.color}18`,
                      color: g.color,
                      fontSize: '0.68rem',
                      fontFamily: c.font.mono,
                      height: 22,
                      '& .MuiChip-icon': { color: g.color },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

export default AttachedContextSection;
