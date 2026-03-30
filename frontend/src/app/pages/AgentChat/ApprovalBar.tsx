import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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
import { parseMcpToolName, useMcpToolMeta, getMcpInputSummary } from './approvalUtils';
import ToolPreview, { getToolIcon, CodeBlock } from './ToolPreview';
import { QuestionForm } from './QuestionForm';

export { QuestionForm } from './QuestionForm';
export type { QuestionFormProps } from './QuestionForm';
export { BatchApprovalBar } from './BatchApprovalBar';
export { parseMcpToolName, useMcpToolMeta } from './approvalUtils';
export type { ParsedTool } from './approvalUtils';
export { getToolIcon } from './ToolPreview';

interface Props {
  request: ApprovalRequest;
  onApprove: (requestId: string, updatedInput?: Record<string, any>) => void;
  onDeny: (requestId: string, message?: string) => void;
}

const GenericApprovalBar: React.FC<Props> = ({ request, onApprove, onDeny }) => {
  const c = useClaudeTokens();
  const [denyMessage, setDenyMessage] = useState('');
  const [showDenyInput, setShowDenyInput] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const parsed = useMemo(() => parseMcpToolName(request.tool_name), [request.tool_name]);
  const meta = useMcpToolMeta(parsed);
  const accentColor = meta.integration?.color || c.status.warning;
  const summary = parsed.isMcp ? getMcpInputSummary(parsed.actionName, request.tool_input) : '';

  if (!parsed.isMcp) {
    return (
      <Box sx={{ bgcolor: c.status.warningBg, border: '1px solid rgba(128,92,31,0.2)', borderRadius: 2.5, p: 2, mx: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
          <Box sx={{ color: c.status.warning, display: 'flex', alignItems: 'center' }}>
            {getToolIcon(request.tool_name)}
          </Box>
          <Typography sx={{ color: c.status.warning, fontWeight: 700, fontSize: '0.85rem' }}>
            Permission Required
          </Typography>
          <Chip label={request.tool_name} size="small" sx={{
            height: 20, fontSize: '0.7rem', fontWeight: 600, fontFamily: c.font.mono,
            bgcolor: 'rgba(128,92,31,0.15)', color: c.status.warning, border: 'none',
          }} />
        </Box>
        <Box sx={{ mb: 1.5 }}>
          <ToolPreview request={request} tokens={c} />
        </Box>
        {showDenyInput && (
          <TextField placeholder="Reason for denying (optional)..." value={denyMessage}
            onChange={(e) => setDenyMessage(e.target.value)} fullWidth size="small"
            sx={{
              mb: 1.5, '& .MuiOutlinedInput-root': {
                color: c.text.primary, fontSize: '0.8rem',
                '& fieldset': { borderColor: c.border.strong },
                '&.Mui-focused fieldset': { borderColor: c.status.error },
              },
            }} />
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<CheckIcon />} onClick={() => onApprove(request.id)}
            sx={{ bgcolor: c.status.success, '&:hover': { bgcolor: '#1e4d15' }, fontWeight: 600, fontSize: '0.8rem' }}>
            Approve
          </Button>
          {showDenyInput ? (
            <Button variant="contained" startIcon={<CloseIcon />}
              onClick={() => { onDeny(request.id, denyMessage || undefined); setShowDenyInput(false); setDenyMessage(''); }}
              sx={{ bgcolor: c.status.error, '&:hover': { bgcolor: '#8f2828' }, fontWeight: 600, fontSize: '0.8rem' }}>
              Deny
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setShowDenyInput(true)}
              sx={{ borderColor: c.status.error, color: c.status.error, '&:hover': { borderColor: '#8f2828', bgcolor: 'rgba(181,51,51,0.04)' }, fontWeight: 600, fontSize: '0.8rem' }}>
              Deny
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      bgcolor: c.bg.surface, border: `1px solid ${c.border.subtle}`, borderLeft: `3px solid ${accentColor}`,
      borderRadius: 2.5, p: 0, mx: 2, mb: 1, overflow: 'hidden',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, pt: 1.75, pb: 0.5 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: 1.5, bgcolor: `${accentColor}14`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {meta.integration?.icon || <ExtensionIcon sx={{ fontSize: 18, color: accentColor }} />}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: c.text.primary, fontWeight: 600, fontSize: '0.9rem' }}>
              {parsed.displayName}
            </Typography>
            <Chip label={meta.serverLabel || parsed.serverSlug} size="small" sx={{
              height: 18, fontSize: '0.65rem', fontWeight: 500,
              bgcolor: `${accentColor}12`, color: accentColor, border: 'none',
              '& .MuiChip-label': { px: 0.6 },
            }} />
          </Box>
          {meta.description && (
            <Typography sx={{
              color: c.text.tertiary, fontSize: '0.78rem', lineHeight: 1.3, mt: 0.15,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {meta.description}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
        {summary && (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
            '&:hover .expand-icon': { color: c.text.secondary },
          }} onClick={() => setDetailsExpanded((v) => !v)}>
            <Typography sx={{
              color: c.text.secondary, fontSize: '0.82rem', fontFamily: c.font.mono,
              flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {summary}
            </Typography>
            <IconButton className="expand-icon" size="small" sx={{ color: c.text.ghost, p: 0.25, flexShrink: 0 }}>
              {detailsExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Box>
        )}
        <Collapse in={detailsExpanded || !summary}>
          <Box sx={{ mt: summary ? 0.75 : 0 }}>
            <CodeBlock tokens={c}>{JSON.stringify(request.tool_input, null, 2)}</CodeBlock>
          </Box>
        </Collapse>
      </Box>

      {showDenyInput && (
        <Box sx={{ px: 2, pb: 0.5 }}>
          <TextField placeholder="Reason for denying (optional)..." value={denyMessage}
            onChange={(e) => setDenyMessage(e.target.value)} fullWidth size="small" autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                color: c.text.primary, fontSize: '0.8rem',
                '& fieldset': { borderColor: c.border.strong },
                '&.Mui-focused fieldset': { borderColor: c.status.error },
              },
            }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1, px: 2, pt: 1, pb: 1.75 }}>
        <Button variant="contained" startIcon={<CheckIcon />} onClick={() => onApprove(request.id)}
          sx={{ bgcolor: c.status.success, '&:hover': { bgcolor: '#1e4d15' }, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', borderRadius: 1.5, px: 2 }}>
          Approve
        </Button>
        {showDenyInput ? (
          <Button variant="contained" startIcon={<CloseIcon />}
            onClick={() => { onDeny(request.id, denyMessage || undefined); setShowDenyInput(false); setDenyMessage(''); }}
            sx={{ bgcolor: c.status.error, '&:hover': { bgcolor: '#8f2828' }, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', borderRadius: 1.5, px: 2 }}>
            Deny
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => setShowDenyInput(true)}
            sx={{ borderColor: c.status.error, color: c.status.error, '&:hover': { borderColor: '#8f2828', bgcolor: 'rgba(181,51,51,0.04)' }, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', borderRadius: 1.5, px: 2 }}>
            Deny
          </Button>
        )}
      </Box>
    </Box>
  );
};

const ApprovalBar: React.FC<Props> = (props) => {
  if (props.request.tool_name === 'AskUserQuestion') {
    return <QuestionForm request={props.request} onApprove={props.onApprove} onDeny={props.onDeny} />;
  }
  return <GenericApprovalBar {...props} />;
};

export default ApprovalBar;
