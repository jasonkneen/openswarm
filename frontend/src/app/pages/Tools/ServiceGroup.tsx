import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { PermToggle } from './PermToggle';

function toDisplayName(name: string, serviceName?: string): string {
  let display = name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  if (serviceName) {
    const svcLower = serviceName.toLowerCase();
    const variants = [svcLower, svcLower.replace(/s$/, '')];
    for (const v of variants) {
      display = display.replace(new RegExp(`\\b${v}\\b`, 'gi'), '').trim();
    }
    display = display.replace(/\s{2,}/g, ' ').trim();
  }
  return display;
}

export function firstSentence(desc: string): string {
  if (!desc) return '';
  const match = desc.match(/^(.+?(?:\.|$))/);
  return match ? match[1].trim() : desc.substring(0, 100);
}

function getGroupPolicy(names: string[], perms: Record<string, string>): string {
  if (names.length === 0) return 'ask';
  const policies = names.map((n) => perms[n] || 'ask');
  if (policies.every((p) => p === 'always_allow')) return 'always_allow';
  if (policies.every((p) => p === 'deny')) return 'deny';
  if (policies.every((p) => p === 'ask')) return 'ask';
  return 'mixed';
}

interface ServiceGroupProps {
  serviceName: string;
  data: { read?: string[]; write?: string[] };
  toolId: string;
  perms: Record<string, string>;
  descriptions: Record<string, string>;
  schemas: Record<string, any>;
  expandedServices: Record<string, boolean>;
  setExpandedServices: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  expandedSchema: string | null;
  setExpandedSchema: React.Dispatch<React.SetStateAction<string | null>>;
  devMode: boolean;
  onPermissionChange: (toolId: string, toolName: string, policy: string) => void;
  onGroupPermissionChange: (toolId: string, names: string[], policy: string) => void;
}

const ToolRow = ({ name, serviceName, desc, schema, schemaKey, perms, devMode, expandedSchema, setExpandedSchema, toolId, onPermissionChange, c }: any) => {
  const schemaProps = schema?.properties as Record<string, any> | undefined;
  const schemaRequired = (schema?.required || []) as string[];
  return (
    <Box key={name}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.4, px: 1.5, borderRadius: 1, cursor: devMode && schema ? 'pointer' : undefined, '&:hover': { bgcolor: c.bg.secondary } }} onClick={() => devMode && schema && setExpandedSchema((p: string | null) => p === schemaKey ? null : schemaKey)}>
        <Box sx={{ minWidth: 0, flex: 1, mr: 1 }}>
          <Typography sx={{ color: c.text.primary, fontSize: '0.8rem', fontWeight: 500 }}>{toDisplayName(name, serviceName)}</Typography>
          {desc && <Typography sx={{ color: c.text.ghost, fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstSentence(desc)}</Typography>}
        </Box>
        <PermToggle value={perms[name] || 'ask'} onChange={(v: string) => onPermissionChange(toolId, name, v)} size={14} />
      </Box>
      {devMode && expandedSchema === schemaKey && schemaProps && (
        <Box sx={{ mx: 1.5, mb: 0.75, px: 1.5, py: 1, bgcolor: c.bg.page, borderRadius: 1, border: `1px solid ${c.border.subtle}` }}>
          <Typography sx={{ color: c.text.ghost, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>Input Parameters</Typography>
          {Object.entries(schemaProps).map(([pName, pDef]: [string, any]) => (
            <Box key={pName} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, py: 0.2 }}>
              <Typography sx={{ color: c.accent.primary, fontSize: '0.72rem', fontFamily: c.font.mono, fontWeight: 600, flexShrink: 0 }}>{pName}</Typography>
              <Typography sx={{ color: c.text.muted, fontSize: '0.68rem', fontFamily: c.font.mono }}>{pDef?.type || 'any'}</Typography>
              {schemaRequired.includes(pName) && <Chip label="required" size="small" sx={{ bgcolor: `${c.status.error}12`, color: c.status.error, fontSize: '0.55rem', height: 14, '& .MuiChip-label': { px: 0.4 } }} />}
              {pDef?.description && <Typography sx={{ color: c.text.ghost, fontSize: '0.68rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pDef.description}</Typography>}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const ToolGroup = ({ label, icon, names, serviceName, descriptions, schemas, perms, devMode, expandedSchema, setExpandedSchema, toolId, onPermissionChange, onGroupPermissionChange, c }: any) => {
  if (!names || names.length === 0) return null;
  const gp = getGroupPolicy(names, perms);
  return (
    <Box sx={{ mt: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5, py: 0.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {icon}
          <Typography sx={{ color: c.text.muted, fontSize: '0.72rem', fontWeight: 600 }}>{label}</Typography>
          <Chip label={names.length} size="small" sx={{ bgcolor: c.bg.page, color: c.text.ghost, fontSize: '0.6rem', height: 14, '& .MuiChip-label': { px: 0.4 } }} />
        </Box>
        <PermToggle value={gp === 'mixed' ? 'ask' : gp} onChange={(v: string) => onGroupPermissionChange(toolId, names, v)} size={14} />
      </Box>
      {names.map((name: string) => (
        <ToolRow key={name} name={name} serviceName={serviceName} desc={descriptions[name]} schema={schemas[name]} schemaKey={`${toolId}:${name}`} perms={perms} devMode={devMode} expandedSchema={expandedSchema} setExpandedSchema={setExpandedSchema} toolId={toolId} onPermissionChange={onPermissionChange} c={c} />
      ))}
    </Box>
  );
};

export const ServiceGroup: React.FC<ServiceGroupProps> = ({
  serviceName, data, toolId, perms, descriptions, schemas,
  expandedServices, setExpandedServices, expandedSchema, setExpandedSchema,
  devMode, onPermissionChange, onGroupPermissionChange,
}) => {
  const c = useClaudeTokens();
  const svcKey = `${toolId}:${serviceName}`;
  const isOpen = expandedServices[svcKey] ?? false;
  const allNames = [...(data.read || []), ...(data.write || [])];
  const svcPolicy = getGroupPolicy(allNames, perms);
  const count = allNames.length;
  const shared = { serviceName, descriptions, schemas, perms, devMode, expandedSchema, setExpandedSchema, toolId, onPermissionChange, onGroupPermissionChange, c };

  return (
    <Box sx={{ border: `1px solid ${c.border.subtle}`, borderRadius: 1.5, overflow: 'hidden', '&:hover': { borderColor: `${c.border.medium}` } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.75, cursor: 'pointer', bgcolor: isOpen ? c.bg.secondary : 'transparent', '&:hover': { bgcolor: c.bg.secondary } }} onClick={() => setExpandedServices((p) => ({ ...p, [svcKey]: !isOpen }))}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: c.text.ghost, transition: 'transform 0.15s', transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
          <Typography sx={{ color: c.text.primary, fontSize: '0.85rem', fontWeight: 600 }}>{serviceName}</Typography>
          <Chip label={count} size="small" sx={{ bgcolor: c.bg.page, color: c.text.muted, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.6 } }} />
        </Box>
        <PermToggle value={svcPolicy === 'mixed' ? 'ask' : svcPolicy} onChange={(v) => onGroupPermissionChange(toolId, allNames, v)} />
      </Box>
      <Collapse in={isOpen}>
        <Box sx={{ px: 1, pb: 1 }}>
          <ToolGroup label="Read-only" icon={<VisibilityIcon sx={{ fontSize: 12, color: c.status.info }} />} iconColor={c.status.info} names={data.read} {...shared} />
          <ToolGroup label="Write / delete" icon={<EditIcon sx={{ fontSize: 12, color: c.status.warning }} />} iconColor={c.status.warning} names={data.write} {...shared} />
        </Box>
      </Collapse>
    </Box>
  );
};
