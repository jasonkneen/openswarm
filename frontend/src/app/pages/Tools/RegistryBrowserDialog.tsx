import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import SortIcon from '@mui/icons-material/Sort';
import CloudIcon from '@mui/icons-material/Cloud';
import PublicIcon from '@mui/icons-material/Public';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { McpServer } from '@/shared/state/mcpRegistrySlice';
import { ToolDefinition } from '@/shared/state/toolsSlice';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { cleanServerName } from './toolUtils';

export interface RegistryBrowserDialogProps {
  open: boolean;
  onClose: () => void;
  regQuery: string;
  regServers: McpServer[];
  regTotal: number;
  regLoading: boolean;
  regStats: any;
  regDetail: any;
  regDetailLoading: boolean;
  regSort: 'name' | 'stars';
  regSource: '' | 'community' | 'google';
  expandedServer: string | null;
  devMode: boolean;
  allTools: ToolDefinition[];
  onSearch: (q: string) => void;
  onSort: (sort: 'name' | 'stars') => void;
  onSourceFilter: (e: React.MouseEvent<HTMLElement>, val: '' | 'community' | 'google') => void;
  onLoadMore: () => void;
  onInstall: (srv: McpServer) => void;
  onEditInstall: (srv: McpServer) => void;
  onExpandServer: (name: string | null) => void;
}

export const RegistryBrowserDialog: React.FC<RegistryBrowserDialogProps> = ({
  open, onClose, regQuery, regServers, regTotal, regLoading, regStats, regDetail, regDetailLoading,
  regSort, regSource, expandedServer, devMode, allTools,
  onSearch, onSort, onSourceFilter, onLoadMore, onInstall, onEditInstall, onExpandServer,
}) => {
  const c = useClaudeTokens();
  const scrollSx = { '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: c.border.medium, borderRadius: 3, '&:hover': { background: c.border.strong } }, scrollbarWidth: 'thin' as const, scrollbarColor: `${c.border.medium} transparent` };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: c.bg.page, backgroundImage: 'none', borderRadius: 4, border: `1px solid ${c.border.subtle}`, height: '80vh' } }}>
      <DialogTitle sx={{ color: c.text.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <StorefrontIcon sx={{ color: c.accent.primary }} /> MCP Registry
        {regStats && (<><Chip label={regSource === 'google' ? `${regStats.google.toLocaleString()} Google servers` : regSource === 'community' ? `${regStats.community.toLocaleString()} Community servers` : `${regStats.total.toLocaleString()} servers`} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.7rem', height: 20, ml: 'auto' }} />
          {devMode && regStats.lastUpdated > 0 && <Typography sx={{ color: c.text.ghost, fontSize: '0.68rem', flexShrink: 0 }}>Synced {Math.round((Date.now() / 1000 - regStats.lastUpdated) / 60)}m ago</Typography>}</>)}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 0, px: 3, pb: 0, overflow: 'hidden', ...scrollSx }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
          <TextField placeholder="Search MCP servers..." value={regQuery} onChange={(e) => onSearch(e.target.value)} fullWidth size="small" autoFocus InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: c.text.ghost, fontSize: 20 }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.surface, borderRadius: 2 } }} />
          <ToggleButtonGroup value={regSource} exclusive onChange={onSourceFilter} size="small" sx={{ flexShrink: 0, '& .MuiToggleButton-root': { color: c.text.ghost, border: `1px solid ${c.border.medium}`, textTransform: 'none', fontSize: '0.72rem', py: 0.5, px: 1.2, lineHeight: 1.4, '&.Mui-selected': { bgcolor: c.bg.secondary, color: c.text.primary, borderColor: c.border.strong }, '&:hover': { bgcolor: c.bg.secondary } } }}>
            <ToggleButton value="">All</ToggleButton>
            <ToggleButton value="community"><PublicIcon sx={{ fontSize: 14, mr: 0.5 }} />Community</ToggleButton>
            <ToggleButton value="google"><CloudIcon sx={{ fontSize: 14, mr: 0.5 }} />Google</ToggleButton>
          </ToggleButtonGroup>
          <Tooltip title={regSort === 'name' ? 'Sort by stars' : 'Sort by name'}>
            <IconButton size="small" onClick={() => onSort(regSort === 'name' ? 'stars' : 'name')} sx={{ color: regSort === 'stars' ? '#c89c00' : c.text.ghost, border: '1px solid', borderColor: regSort === 'stars' ? '#c89c0040' : c.border.medium, borderRadius: 1.5, px: 1, flexShrink: 0, '&:hover': { borderColor: '#c89c00', color: '#c89c00' } }}><StarIcon sx={{ fontSize: 16 }} /><SortIcon sx={{ fontSize: 14, ml: 0.25 }} /></IconButton>
          </Tooltip>
        </Box>
        {regLoading && regServers.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}><CircularProgress sx={{ color: c.accent.primary }} size={28} /></Box>
        ) : regServers.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: c.text.ghost, gap: 1.5 }}><SearchIcon sx={{ fontSize: 40, opacity: 0.3 }} /><Typography sx={{ fontSize: '0.9rem' }}>No servers found matching "{regQuery}"</Typography></Box>
        ) : (
          <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, ...scrollSx }}>
            <Typography sx={{ color: c.text.ghost, fontSize: '0.75rem', mb: 0.5 }}>Showing {regServers.length} of {regTotal.toLocaleString()} results</Typography>
            {regServers.map((srv) => {
              const isExpanded = expandedServer === srv.name;
              const isInstalled = allTools.some((t) => t.name === (srv.title || cleanServerName(srv.name)));
              return (
                <Box key={srv.name}>
                  <Box onClick={() => onExpandServer(isExpanded ? null : srv.name)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, borderRadius: 1.5, cursor: 'pointer', transition: 'background 0.15s', '&:hover': { bgcolor: c.bg.secondary }, ...(isExpanded && { bgcolor: c.bg.secondary }) }}>
                    <Avatar src={srv.iconUrl || undefined} sx={{ width: 24, height: 24, flexShrink: 0, bgcolor: c.bg.secondary, fontSize: '0.7rem', fontWeight: 700, color: c.text.muted }}>{srv.iconUrl ? null : (srv.title || cleanServerName(srv.name)).charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: c.text.primary, fontWeight: 600, fontSize: '0.88rem', fontFamily: c.font.mono }}>{srv.title || cleanServerName(srv.name)}</Typography>
                        {srv.version && <Chip label={`v${srv.version}`} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.6 } }} />}
                        {srv.remoteType && <Chip label={srv.remoteType} size="small" sx={{ bgcolor: '#3b82f615', color: '#3b82f6', fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.6 } }} />}
                        {srv.source === 'google' ? <Chip icon={<CloudIcon sx={{ fontSize: 12 }} />} label="Google" size="small" sx={{ bgcolor: `${c.status.info}15`, color: c.status.info, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.4 }, '& .MuiChip-icon': { ml: 0.4, color: c.status.info } }} /> : <Chip icon={<PublicIcon sx={{ fontSize: 12 }} />} label="Community" size="small" sx={{ bgcolor: 'rgba(174,86,48,0.08)', color: c.accent.primary, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.4 }, '& .MuiChip-icon': { ml: 0.4, color: c.accent.primary } }} />}
                        {srv.stars != null && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, ml: 0.5 }}><StarIcon sx={{ fontSize: 13, color: '#c89c00' }} /><Typography sx={{ color: c.text.muted, fontSize: '0.7rem', fontWeight: 600, lineHeight: 1 }}>{srv.stars >= 1000 ? `${(srv.stars / 1000).toFixed(1)}k` : srv.stars.toLocaleString()}</Typography></Box>}
                        {devMode && !srv.remoteType && <Chip label="stdio" size="small" sx={{ bgcolor: '#8b5cf615', color: '#8b5cf6', fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.6 } }} />}
                        {isInstalled && <Chip icon={<CheckCircleIcon sx={{ fontSize: 12 }} />} label="Installed" size="small" sx={{ bgcolor: `${c.status.success}15`, color: c.status.success, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.4 }, '& .MuiChip-icon': { ml: 0.4, color: c.status.success } }} />}
                      </Box>
                      <Typography sx={{ color: c.text.tertiary, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{srv.description}</Typography>
                    </Box>
                    <KeyboardArrowDownIcon sx={{ fontSize: 16, color: c.text.ghost, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                  </Box>
                  <Collapse in={isExpanded}>
                    <Box sx={{ ml: 4.5, mr: 1.5, mb: 1, px: 2, py: 1.5, bgcolor: c.bg.elevated, borderRadius: 1.5, borderLeft: '2px solid rgba(174,86,48,0.12)' }}>
                      <Typography sx={{ color: c.text.secondary, fontSize: '0.85rem', mb: 1.5, lineHeight: 1.5 }}>{srv.description}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        <Typography sx={{ color: c.text.ghost, fontSize: '0.72rem', fontFamily: c.font.mono }}>{srv.name}</Typography>
                        {srv.remoteUrl && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Typography sx={{ color: c.text.ghost, fontSize: '0.72rem', textTransform: 'uppercase' }}>Endpoint</Typography><Typography sx={{ color: c.text.muted, fontSize: '0.78rem', fontFamily: c.font.mono }}>{srv.remoteUrl}</Typography></Box>}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {srv.websiteUrl && <Chip component="a" href={srv.websiteUrl} clickable icon={<OpenInNewIcon sx={{ fontSize: 12 }} />} label="Website" size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.7rem', height: 22 }} />}
                          {srv.repositoryUrl && <Chip component="a" href={srv.repositoryUrl} clickable icon={<OpenInNewIcon sx={{ fontSize: 12 }} />} label="Repository" size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.7rem', height: 22 }} />}
                        </Box>
                      </Box>
                      {devMode && (
                        <Box sx={{ mb: 2 }}>
                          {regDetailLoading && expandedServer === srv.name ? <CircularProgress size={14} sx={{ color: c.text.ghost }} /> : regDetail && regDetail.name === srv.name ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              {(regDetail.keywords?.length > 0 || regDetail.license) && <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>{regDetail.license && <Chip label={regDetail.license} size="small" sx={{ bgcolor: `${c.status.info}15`, color: c.status.info, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.6 } }} />}{regDetail.keywords?.map((kw: string) => <Chip key={kw} label={kw} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.6 } }} />)}</Box>}
                              {regDetail.environmentVariables?.length > 0 && (
                                <Box sx={{ bgcolor: c.bg.page, borderRadius: 1.5, border: `1px solid ${c.border.subtle}`, px: 1.5, py: 1 }}>
                                  <Typography sx={{ color: c.text.muted, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.75 }}>Required Environment Variables</Typography>
                                  {regDetail.environmentVariables.map((ev: any) => <Box key={ev.name} sx={{ display: 'flex', alignItems: 'baseline', gap: 1, py: 0.25 }}><Typography sx={{ color: c.accent.primary, fontSize: '0.75rem', fontFamily: c.font.mono, fontWeight: 600, flexShrink: 0 }}>{ev.name}</Typography>{ev.description && <Typography sx={{ color: c.text.ghost, fontSize: '0.72rem' }}>{ev.description}</Typography>}</Box>)}
                                </Box>
                              )}
                            </Box>
                          ) : null}
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="contained" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />} onClick={(e) => { e.stopPropagation(); onInstall(srv); }} sx={{ bgcolor: c.accent.primary, '&:hover': { bgcolor: c.accent.pressed }, textTransform: 'none', fontSize: '0.78rem', borderRadius: 1.5, py: 0.5 }}>Install</Button>
                        <Button size="small" variant="outlined" startIcon={<EditIcon sx={{ fontSize: 14 }} />} onClick={(e) => { e.stopPropagation(); onEditInstall(srv); }} sx={{ borderColor: c.border.strong, color: c.text.secondary, '&:hover': { borderColor: c.accent.primary, color: c.text.primary }, textTransform: 'none', fontSize: '0.78rem', borderRadius: 1.5, py: 0.5 }}>Edit & Install</Button>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
            {regServers.length < regTotal && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button onClick={onLoadMore} disabled={regLoading} sx={{ color: c.accent.primary, textTransform: 'none', fontSize: '0.85rem' }}>{regLoading ? <CircularProgress size={16} sx={{ color: c.accent.primary, mr: 1 }} /> : null}Load More</Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={onClose} sx={{ color: c.text.tertiary, textTransform: 'none' }}>Close</Button></DialogActions>
    </Dialog>
  );
};
