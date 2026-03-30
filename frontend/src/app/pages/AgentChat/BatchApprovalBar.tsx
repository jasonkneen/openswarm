import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExtensionIcon from '@mui/icons-material/Extension';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ApprovalRequest } from '@/shared/state/agentsSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { ParsedTool, parseMcpToolName, useMcpToolMeta } from './approvalUtils';
import { getToolIcon } from './ToolPreview';
import { QuestionForm } from './QuestionForm';
import ApprovalBar from './ApprovalBar';

interface ToolGroup {
  toolName: string;
  parsed: ParsedTool;
  requests: ApprovalRequest[];
}

interface BatchApprovalBarProps {
  requests: ApprovalRequest[];
  onApprove: (requestId: string, updatedInput?: Record<string, any>) => void;
  onDeny: (requestId: string, message?: string) => void;
}

export const BatchApprovalBar: React.FC<BatchApprovalBarProps> = ({ requests, onApprove, onDeny }) => {
  const c = useClaudeTokens();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const questions = requests.filter((r) => r.tool_name === 'AskUserQuestion');
  const nonQuestions = requests.filter((r) => r.tool_name !== 'AskUserQuestion');

  const groups = useMemo(() => {
    const map = new Map<string, ToolGroup>();
    for (const req of nonQuestions) {
      const existing = map.get(req.tool_name);
      if (existing) {
        existing.requests.push(req);
      } else {
        map.set(req.tool_name, {
          toolName: req.tool_name,
          parsed: parseMcpToolName(req.tool_name),
          requests: [req],
        });
      }
    }
    return Array.from(map.values());
  }, [nonQuestions]);

  const handleApproveAll = () => { for (const req of nonQuestions) onApprove(req.id); };
  const handleDenyAll = () => { for (const req of nonQuestions) onDeny(req.id); };
  const handleApproveGroup = (g: ToolGroup) => { for (const req of g.requests) onApprove(req.id); };
  const handleDenyGroup = (g: ToolGroup) => { for (const req of g.requests) onDeny(req.id); };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {questions.map((req) => (
        <QuestionForm key={req.id} request={req} onApprove={onApprove} onDeny={onDeny} />
      ))}

      {nonQuestions.length > 1 && (
        <Box sx={{
          mx: 2, mb: 0.5, borderRadius: 2.5, border: `1px solid ${c.border.subtle}`,
          bgcolor: c.bg.surface, overflow: 'hidden',
        }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25,
            bgcolor: c.status.warningBg, borderBottom: `1px solid ${c.border.subtle}`,
          }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: c.status.warning, flex: 1 }}>
              {nonQuestions.length} pending approvals
            </Typography>
            <Button variant="contained" size="small" startIcon={<CheckIcon />} onClick={handleApproveAll}
              sx={{ bgcolor: c.status.success, '&:hover': { bgcolor: '#1e4d15' }, fontWeight: 600, fontSize: '0.78rem', textTransform: 'none', borderRadius: 1.5, px: 1.5, minHeight: 30 }}>
              Approve All
            </Button>
            <Button variant="outlined" size="small" startIcon={<CloseIcon />} onClick={handleDenyAll}
              sx={{ borderColor: c.status.error, color: c.status.error, '&:hover': { borderColor: '#8f2828', bgcolor: 'rgba(181,51,51,0.04)' }, fontWeight: 600, fontSize: '0.78rem', textTransform: 'none', borderRadius: 1.5, px: 1.5, minHeight: 30 }}>
              Deny All
            </Button>
          </Box>

          {groups.map((group) => (
            <GroupRow
              key={group.toolName}
              group={group}
              expanded={expandedGroup === group.toolName}
              onToggle={() => setExpandedGroup((prev) => prev === group.toolName ? null : group.toolName)}
              onApprove={onApprove}
              onDeny={onDeny}
              onApproveGroup={() => handleApproveGroup(group)}
              onDenyGroup={() => handleDenyGroup(group)}
            />
          ))}
        </Box>
      )}

      {nonQuestions.length === 1 && (
        <ApprovalBar request={nonQuestions[0]} onApprove={onApprove} onDeny={onDeny} />
      )}
    </Box>
  );
};

interface GroupRowProps {
  group: ToolGroup;
  expanded: boolean;
  onToggle: () => void;
  onApprove: (requestId: string, updatedInput?: Record<string, any>) => void;
  onDeny: (requestId: string, message?: string) => void;
  onApproveGroup: () => void;
  onDenyGroup: () => void;
}

const GroupRow: React.FC<GroupRowProps> = ({ group, expanded, onToggle, onApprove, onDeny, onApproveGroup, onDenyGroup }) => {
  const c = useClaudeTokens();
  const meta = useMcpToolMeta(group.parsed);
  const accentColor = meta.integration?.color || c.status.warning;

  return (
    <Box sx={{ borderBottom: `1px solid ${c.border.subtle}`, '&:last-child': { borderBottom: 'none' } }}>
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1,
          cursor: 'pointer', '&:hover': { bgcolor: c.bg.secondary }, transition: 'background-color 0.1s',
        }}
      >
        <Box sx={{
          width: 26, height: 26, borderRadius: 1, bgcolor: `${accentColor}14`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {group.parsed.isMcp
            ? (meta.integration?.icon || <ExtensionIcon sx={{ fontSize: 15, color: accentColor }} />)
            : getToolIcon(group.toolName)}
        </Box>

        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: c.text.primary, flex: 1 }}>
          {group.parsed.isMcp ? group.parsed.displayName : group.toolName}
        </Typography>

        <Chip label={`${group.requests.length}`} size="small"
          sx={{ height: 20, minWidth: 24, fontSize: '0.72rem', fontWeight: 700, bgcolor: `${accentColor}18`, color: accentColor, border: 'none' }} />

        {group.requests.length > 1 && (
          <>
            <Button variant="text" size="small"
              onClick={(e) => { e.stopPropagation(); onApproveGroup(); }}
              sx={{ color: c.status.success, fontWeight: 600, fontSize: '0.72rem', textTransform: 'none', minWidth: 0, px: 1, minHeight: 24 }}>
              Approve {group.requests.length}
            </Button>
            <Button variant="text" size="small"
              onClick={(e) => { e.stopPropagation(); onDenyGroup(); }}
              sx={{ color: c.status.error, fontWeight: 600, fontSize: '0.72rem', textTransform: 'none', minWidth: 0, px: 1, minHeight: 24 }}>
              Deny {group.requests.length}
            </Button>
          </>
        )}

        <IconButton size="small" sx={{ color: c.text.ghost, p: 0.25 }}>
          {expanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ px: 1, pb: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {group.requests.map((req) => (
            <ApprovalBar key={req.id} request={req} onApprove={onApprove} onDeny={onDeny} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};
