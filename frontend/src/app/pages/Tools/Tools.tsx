import React from 'react';
import { Box, Typography, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, CircularProgress, Tooltip, Collapse, Menu, MenuItem, Snackbar, Alert, Switch, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Build as BuildIcon, Extension as ExtensionIcon, Terminal as TerminalIcon, Search as SearchIcon, Lock as LockIcon, KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowRight as KeyboardArrowRightIcon, HourglassEmpty as HourglassEmptyIcon, Storefront as StorefrontIcon, OpenInNew as OpenInNewIcon, CheckCircle as CheckCircleIcon, Settings as SettingsIcon, Security as SecurityIcon, Refresh as RefreshIcon, Link as LinkIcon, Public as PublicIcon, ViewQuilt as ViewQuiltIcon } from '@mui/icons-material';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { ToolSection } from './ToolSection';
import { PermToggle } from './PermToggle';
import { ServiceGroup, firstSentence } from './ServiceGroup';
import { RegistryBrowserDialog } from './RegistryBrowserDialog';
import { McpConfigDialog } from './McpConfigDialog';
import { CredentialsDialog } from './CredentialsDialog';
import { useToolsState } from './hooks/useToolsState';

const Tools: React.FC = () => {
  const c = useClaudeTokens(); const s = useToolsState();
  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: c.text.primary, fontWeight: 700, mb: 0.5 }}>Action Library</Typography>
          <Typography sx={{ color: c.text.tertiary, fontSize: '0.9rem' }}>Define and manage custom actions for your Claude Code agents.</Typography>
        </Box>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />} onClick={s.handleMenuOpen} sx={{ bgcolor: c.accent.primary, '&:hover': { bgcolor: c.accent.pressed }, textTransform: 'none', borderRadius: 2 }}>New Action</Button>
          <Menu anchorEl={s.menuAnchor} open={!!s.menuAnchor} onClose={s.handleMenuClose} PaperProps={{ sx: { bgcolor: c.bg.surface, border: `1px solid ${c.border.subtle}`, borderRadius: 2, mt: 0.5, minWidth: 200 } }}>
            <MenuItem onClick={s.openCreate} sx={{ color: c.text.primary, fontSize: '0.88rem', gap: 1.5, '&:hover': { bgcolor: c.bg.secondary } }}><BuildIcon sx={{ fontSize: 16, color: c.text.tertiary }} />Create Custom</MenuItem>
            <MenuItem onClick={s.openRegistryBrowser} sx={{ color: c.text.primary, fontSize: '0.88rem', gap: 1.5, '&:hover': { bgcolor: c.bg.secondary } }}><StorefrontIcon sx={{ fontSize: 16, color: c.text.tertiary }} />Browse MCP Registry</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box onClick={() => s.setBuiltinSectionOpen((v: boolean) => !v)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, cursor: 'pointer', userSelect: 'none', '&:hover .section-arrow': { color: c.text.secondary } }}>
          {s.builtinSectionOpen ? <KeyboardArrowDownIcon className="section-arrow" sx={{ fontSize: 18, color: c.text.tertiary }} /> : <KeyboardArrowRightIcon className="section-arrow" sx={{ fontSize: 18, color: c.text.tertiary }} />}
          <LockIcon sx={{ fontSize: 14, color: c.text.tertiary }} />
          <Typography sx={{ color: c.text.muted, fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Built-in Action Sets</Typography>
          <Chip label={s.coreTools.length + s.deferredTools.length + s.outputs.length + s.browserTools.length} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.7rem', height: 18, minWidth: 24, '& .MuiChip-label': { px: 0.8 } }} />
        </Box>
        <Collapse in={s.builtinSectionOpen}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 1 }}>
            {s.coreTools.length > 0 && <ToolSection label="Core Actions" icon={<LockIcon sx={{ fontSize: 14, color: c.text.tertiary }} />} count={s.coreTools.length} open={s.coreSectionOpen} onToggle={() => s.setCoreSectionOpen((v: boolean) => !v)} grouped={s.groupedCore} collapsedCategories={s.collapsedCategories} toggleCategory={s.toggleCategory} expandedBuiltin={s.expandedBuiltin} toggleBuiltinExpand={s.toggleBuiltinExpand} builtinPermissions={s.builtinPermissions} onPermissionChange={s.handleBuiltinPermissionChange} onCategoryPermissionChange={s.handleBuiltinCategoryPermissionChange} enabled={s.coreSectionEnabled} onEnabledChange={(v) => s.handleSectionEnabledChange(s.coreTools, v)} />}
            {s.deferredTools.length > 0 && <ToolSection label="Extended Actions" icon={<HourglassEmptyIcon sx={{ fontSize: 14, color: c.text.tertiary }} />} count={s.deferredTools.length} open={s.deferredSectionOpen} onToggle={() => s.setDeferredSectionOpen((v: boolean) => !v)} grouped={s.groupedDeferred} collapsedCategories={s.collapsedCategories} toggleCategory={s.toggleCategory} expandedBuiltin={s.expandedBuiltin} toggleBuiltinExpand={s.toggleBuiltinExpand} deferred builtinPermissions={s.builtinPermissions} onPermissionChange={s.handleBuiltinPermissionChange} onCategoryPermissionChange={s.handleBuiltinCategoryPermissionChange} enabled={s.deferredSectionEnabled} onEnabledChange={(v) => s.handleSectionEnabledChange(s.deferredTools, v)} />}
            {s.outputs.length > 0 && (
              <Card sx={{ bgcolor: c.bg.surface, border: `1px solid ${s.viewsSectionOpen && s.viewsSectionEnabled ? c.accent.primary : c.border.subtle}`, borderRadius: 2, boxShadow: c.shadow.sm, '&:hover': { borderColor: c.accent.primary }, transition: 'border-color 0.2s' }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Box onClick={() => s.viewsSectionEnabled && s.setViewsSectionOpen((v: boolean) => !v)} sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: s.viewsSectionEnabled ? 'pointer' : 'default' }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: c.bg.secondary, color: c.text.tertiary, opacity: s.viewsSectionEnabled ? 1 : 0.4 }}><ViewQuiltIcon sx={{ fontSize: 18 }} /></Box>
                    <Box sx={{ flex: 1, minWidth: 0, opacity: s.viewsSectionEnabled ? 1 : 0.4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}><Typography sx={{ color: c.text.primary, fontWeight: 600, fontSize: '0.95rem' }}>Apps</Typography><Chip label={`${s.outputs.length} app${s.outputs.length !== 1 ? 's' : ''}`} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.7rem', height: 20 }} /></Box>
                      <Typography sx={{ color: c.text.muted, fontSize: '0.84rem' }}>Dashboard apps and data displays for your agent</Typography>
                    </Box>
                    <Box onClick={(e) => e.stopPropagation()}><Switch checked={s.viewsSectionEnabled} onChange={(_, checked) => s.handleViewsSectionEnabledChange(checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: c.accent.primary }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: c.accent.primary } }} /></Box>
                    {s.viewsSectionEnabled && <KeyboardArrowDownIcon sx={{ fontSize: 18, color: c.text.ghost, transform: s.viewsSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
                  </Box>
                </CardContent>
                <Collapse in={s.viewsSectionOpen && s.viewsSectionEnabled}>
                  <Box sx={{ px: 2, pb: 2, borderTop: `1px solid ${c.border.subtle}` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1.5 }}>
                      {s.outputs.map((out) => (
                        <Box key={out.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5, px: 1.5, borderRadius: 1, '&:hover': { bgcolor: c.bg.secondary } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, mr: 1 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${out.color}20` }}><ViewQuiltIcon sx={{ fontSize: 14, color: out.color }} /></Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ color: c.text.primary, fontSize: '0.8rem', fontWeight: 500 }}>{out.name}</Typography><Chip label={out.category} size="small" sx={{ bgcolor: `${out.color}15`, color: out.color, fontSize: '0.65rem', height: 18 }} /></Box>
                              {out.description && <Typography sx={{ color: c.text.ghost, fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{out.description}</Typography>}
                            </Box>
                          </Box>
                          <PermToggle value={out.permission || 'ask'} onChange={(v) => s.handleViewPermissionChange(out.id, v)} size={14} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Collapse>
              </Card>
            )}
            {s.browserTools.length > 0 && (
              <Card sx={{ bgcolor: c.bg.surface, border: `1px solid ${s.browserSectionOpen && s.browserSectionEnabled ? c.accent.primary : c.border.subtle}`, borderRadius: 2, boxShadow: c.shadow.sm, '&:hover': { borderColor: c.accent.primary }, transition: 'border-color 0.2s' }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Box onClick={() => s.browserSectionEnabled && s.setBrowserSectionOpen((v: boolean) => !v)} sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: s.browserSectionEnabled ? 'pointer' : 'default' }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: c.bg.secondary, color: c.text.tertiary, opacity: s.browserSectionEnabled ? 1 : 0.4 }}><PublicIcon sx={{ fontSize: 18 }} /></Box>
                    <Box sx={{ flex: 1, minWidth: 0, opacity: s.browserSectionEnabled ? 1 : 0.4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}><Typography sx={{ color: c.text.primary, fontWeight: 600, fontSize: '0.95rem' }}>Browser</Typography><Chip label={`${s.browserTools.length} actions`} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.7rem', height: 20 }} /></Box>
                      <Typography sx={{ color: c.text.muted, fontSize: '0.84rem' }}>Browser automation delegation and individual browser actions</Typography>
                    </Box>
                    <Box onClick={(e) => e.stopPropagation()}><Switch checked={s.browserSectionEnabled} onChange={(_, checked) => s.handleSectionEnabledChange(s.browserTools, checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: c.accent.primary }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: c.accent.primary } }} /></Box>
                    {s.browserSectionEnabled && <KeyboardArrowDownIcon sx={{ fontSize: 18, color: c.text.ghost, transform: s.browserSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
                  </Box>
                </CardContent>
                <Collapse in={s.browserSectionOpen && s.browserSectionEnabled}>
                  <Box sx={{ px: 2, pb: 2, borderTop: `1px solid ${c.border.subtle}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, mb: 1 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><SecurityIcon sx={{ fontSize: 14, color: c.text.muted }} /><Typography sx={{ color: c.text.muted, fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Action Permissions</Typography><Chip label={`${s.browserTools.length} actions`} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.ghost, fontSize: '0.65rem', height: 18, ml: 0.5 }} /></Box></Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {[{ tools: s.browserDelegationTools, label: 'Delegation', key: 'browser_delegation' }, { tools: s.browserActionTools, label: 'Browser Actions', key: 'browser_action' }].map(({ tools: bTools, label, key }) => bTools.length > 0 && (() => {
                        const policies = bTools.map((t) => s.builtinPermissions[t.name] || 'always_allow');
                        const gp = policies.every((p) => p === 'always_allow') ? 'always_allow' : policies.every((p) => p === 'deny') ? 'deny' : policies.every((p) => p === 'ask') ? 'ask' : 'ask';
                        const isOpen = !s.browserCollapsed[key];
                        return (
                          <Box key={key} sx={{ border: `1px solid ${c.border.subtle}`, borderRadius: 1.5, overflow: 'hidden', '&:hover': { borderColor: c.border.medium } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.75, cursor: 'pointer', bgcolor: isOpen ? c.bg.secondary : 'transparent', '&:hover': { bgcolor: c.bg.secondary } }} onClick={() => s.setBrowserCollapsed((p: Record<string, boolean>) => ({ ...p, [key]: !p[key] }))}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><KeyboardArrowDownIcon sx={{ fontSize: 16, color: c.text.ghost, transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }} /><Typography sx={{ color: c.text.primary, fontSize: '0.85rem', fontWeight: 600 }}>{label}</Typography><Chip label={bTools.length} size="small" sx={{ bgcolor: c.bg.page, color: c.text.muted, fontSize: '0.65rem', height: 18 }} /></Box>
                              <PermToggle value={gp} onChange={(v) => s.handleBuiltinCategoryPermissionChange(bTools.map((t) => t.name), v)} />
                            </Box>
                            <Collapse in={isOpen}><Box sx={{ px: 1, pb: 1 }}>
                              {bTools.map((bt) => (
                                <Box key={bt.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.4, px: 1.5, borderRadius: 1, '&:hover': { bgcolor: c.bg.secondary } }}>
                                  <Box sx={{ minWidth: 0, flex: 1, mr: 1 }}><Typography sx={{ color: c.text.primary, fontSize: '0.8rem', fontWeight: 500 }}>{bt.display_name || bt.name}</Typography>{bt.description && <Typography sx={{ color: c.text.ghost, fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstSentence(bt.description)}</Typography>}</Box>
                                  <PermToggle value={s.builtinPermissions[bt.name] || 'always_allow'} onChange={(v) => s.handleBuiltinPermissionChange(bt.name, v)} size={14} />
                                </Box>
                              ))}
                            </Box></Collapse>
                          </Box>
                        );
                      })())}
                    </Box>
                  </Box>
                </Collapse>
              </Card>
            )}
          </Box>
        </Collapse>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box onClick={() => s.setCustomSectionOpen((v: boolean) => !v)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, cursor: 'pointer', userSelect: 'none', '&:hover .section-arrow': { color: c.text.secondary } }}>
          {s.customSectionOpen ? <KeyboardArrowDownIcon className="section-arrow" sx={{ fontSize: 18, color: c.text.tertiary }} /> : <KeyboardArrowRightIcon className="section-arrow" sx={{ fontSize: 18, color: c.text.tertiary }} />}
          <BuildIcon sx={{ fontSize: 14, color: c.text.tertiary }} />
          <Typography sx={{ color: c.text.muted, fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custom Action Sets</Typography>
          <Chip label={s.tools.length + s.uninstalledIntegrations.length} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.muted, fontSize: '0.7rem', height: 18, minWidth: 24, '& .MuiChip-label': { px: 0.8 } }} />
        </Box>
        <Collapse in={s.customSectionOpen}>
          {s.loading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress sx={{ color: c.accent.primary }} size={28} /></Box>
          : (s.tools.length === 0 && s.uninstalledIntegrations.length === 0) ? <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, color: c.text.ghost, gap: 1.5 }}><BuildIcon sx={{ fontSize: 40, opacity: 0.3 }} /><Typography sx={{ fontSize: '0.9rem' }}>No custom actions defined yet. Create one to get started.</Typography></Box>
          : <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 1 }}>
              {s.uninstalledIntegrations.map((ig) => {
                const isLoading = !!s.integrationLoading[ig.id];
                return (
                  <Card key={ig.id} sx={{ bgcolor: c.bg.surface, border: `1px solid ${c.border.subtle}`, borderRadius: 2, boxShadow: c.shadow.sm }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: c.bg.secondary }}>{ig.icon}</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}><Typography sx={{ color: c.text.primary, fontWeight: 600, fontSize: '0.95rem' }}>{ig.name}</Typography><Chip component="a" href={ig.website} clickable icon={<OpenInNewIcon sx={{ fontSize: 10 }} />} label="docs" size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.ghost, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.4 }, '& .MuiChip-icon': { ml: 0.4, fontSize: 10 } }} /></Box>
                          <Typography sx={{ color: c.text.muted, fontSize: '0.84rem' }}>{ig.description}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                          {ig.comingSoon ? <Chip label="Coming Soon" size="small" sx={{ bgcolor: `${ig.color}15`, color: ig.color, fontSize: '0.7rem', fontStyle: 'italic', height: 24 }} /> : (<>
                            {(ig.authType === 'oauth2' || ig.credentialFields) && <Button size="small" variant="outlined" startIcon={isLoading ? <CircularProgress size={14} /> : <LinkIcon sx={{ fontSize: 14 }} />} onClick={() => s.handleDirectConnect(ig)} disabled={isLoading} sx={{ borderColor: `${ig.color}40`, color: ig.color, '&:hover': { borderColor: ig.color, bgcolor: `${ig.color}10` }, textTransform: 'none', fontSize: '0.78rem', borderRadius: 1.5, py: 0.5, mr: 0.5 }}>{ig.connectLabel || `Connect ${ig.name}`}</Button>}
                            {isLoading && !(ig.authType === 'oauth2' || ig.credentialFields) && <CircularProgress size={16} sx={{ color: ig.color }} />}
                            <Switch checked={false} onChange={() => s.handleIntegrationToggle(ig)} disabled={isLoading} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: ig.color }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: ig.color } }} />
                          </>)}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
              {s.tools.map((tool) => {
                const ig = s.getIntegrationForTool(tool); const isExpanded = s.expandedToolId === tool.id;
                const isMcp = tool.mcp_config && Object.keys(tool.mcp_config).length > 0; const isStdio = isMcp && (tool.mcp_config.type === 'stdio' || !!tool.mcp_config.command); const canDiscover = isMcp;
                const perms = tool.tool_permissions || {}; const services = perms._services as Record<string, { read?: string[]; write?: string[] }> | undefined;
                const descriptions = (perms._tool_descriptions || {}) as Record<string, string>; const schemas = (perms._tool_schemas || {}) as Record<string, any>;
                const serviceNames = services ? Object.keys(services) : []; const hasPerms = serviceNames.length > 0;
                const totalToolCount = serviceNames.reduce((acc, sv) => acc + (services![sv].read?.length || 0) + (services![sv].write?.length || 0), 0);
                const isComingSoon = ig?.comingSoon === true; const isDisabled = tool.enabled === false || isComingSoon;
                return (
                  <Card key={tool.id} sx={{ bgcolor: c.bg.surface, border: `1px solid ${isExpanded ? c.accent.primary : c.border.subtle}`, borderRadius: 2, boxShadow: c.shadow.sm, '&:hover': { borderColor: isDisabled ? c.border.subtle : c.accent.primary }, transition: 'border-color 0.2s' }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: isDisabled ? 'default' : 'pointer' }} onClick={() => !isDisabled && s.setExpandedToolId(isExpanded ? null : tool.id)}>
                        {ig && <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${ig.color}18`, color: ig.color, opacity: isDisabled ? 0.4 : 1 }}>{ig.icon}</Box>}
                        <Box sx={{ flex: 1, minWidth: 0, opacity: isDisabled ? 0.4 : 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                            <Typography sx={{ color: c.text.primary, fontWeight: 600, fontSize: '0.95rem' }}>{tool.name}</Typography>
                            {isMcp && <Chip icon={<ExtensionIcon sx={{ fontSize: 12 }} />} label={isStdio ? 'MCP · stdio' : 'MCP'} size="small" sx={{ bgcolor: `${c.status.warning}20`, color: c.status.warning, fontSize: '0.75rem', height: 24 }} />}
                            {tool.command && <Chip icon={<TerminalIcon sx={{ fontSize: 12 }} />} label={`/${tool.command}`} size="small" sx={{ bgcolor: 'rgba(174,86,48,0.12)', color: c.accent.hover, fontSize: '0.72rem', height: 22 }} />}
                            {tool.auth_status === 'connected' && !ig && <Chip icon={<CheckCircleIcon sx={{ fontSize: 12 }} />} label={tool.connected_account_email ? `Connected · ${tool.connected_account_email}` : 'Connected'} size="small" sx={{ bgcolor: c.status.successBg, color: c.status.success, fontSize: '0.7rem', height: 20, '& .MuiChip-icon': { color: c.status.success } }} />}
                            {tool.auth_status === 'configured' && !ig?.credentialFields && <Chip icon={<SettingsIcon sx={{ fontSize: 12 }} />} label="Configured" size="small" sx={{ bgcolor: c.status.warningBg, color: c.status.warning, fontSize: '0.7rem', height: 20, '& .MuiChip-icon': { color: c.status.warning } }} />}
                            {ig && totalToolCount > 0 && <Chip label={`${totalToolCount} actions`} size="small" sx={{ bgcolor: `${ig.color}15`, color: ig.color, fontSize: '0.7rem', height: 20 }} />}
                            {ig && <Chip component="a" href={ig.website} clickable icon={<OpenInNewIcon sx={{ fontSize: 10 }} />} label="docs" size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.ghost, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.4 }, '& .MuiChip-icon': { ml: 0.4, fontSize: 10 } }} />}
                          </Box>
                          {tool.description && <Typography sx={{ color: c.text.muted, fontSize: '0.84rem' }}>{tool.description}</Typography>}
                        </Box>
                        {isComingSoon && <Chip label="Coming Soon" size="small" sx={{ bgcolor: `${ig?.color || c.text.ghost}15`, color: ig?.color || c.text.ghost, fontSize: '0.7rem', fontStyle: 'italic', height: 24, flexShrink: 0 }} />}
                        {!isComingSoon && !isDisabled && tool.auth_type === 'oauth2' && tool.auth_status !== 'connected' && <Button size="small" variant="outlined" startIcon={<LinkIcon sx={{ fontSize: 14 }} />} onClick={(e) => { e.stopPropagation(); s.handleOAuthConnect(tool.id); }} sx={{ borderColor: `${c.status.info}40`, color: c.status.info, '&:hover': { borderColor: c.status.info, bgcolor: `${c.status.info}10` }, textTransform: 'none', fontSize: '0.78rem', borderRadius: 1.5, py: 0.5, flexShrink: 0 }}>{ig?.connectLabel || `Connect ${ig?.name || 'Account'}`}</Button>}
                        {!isComingSoon && !isDisabled && ig?.credentialFields && tool.auth_status !== 'connected' && <Button size="small" variant="outlined" startIcon={<LinkIcon sx={{ fontSize: 14 }} />} onClick={(e) => { e.stopPropagation(); s.openCredentialsDialog(tool.id, ig); }} sx={{ borderColor: `${ig.color}40`, color: ig.color, '&:hover': { borderColor: ig.color, bgcolor: `${ig.color}10` }, textTransform: 'none', fontSize: '0.78rem', borderRadius: 1.5, py: 0.5, flexShrink: 0 }}>{ig.connectLabel || 'Connect'}</Button>}
                        {!isComingSoon && !isDisabled && ig && tool.auth_status === 'connected' && <Tooltip title={ig.credentialFields || ig.authType === 'oauth2' ? 'Disconnect' : ''}><Chip icon={<CheckCircleIcon sx={{ fontSize: 12 }} />} label={tool.connected_account_email ? `Connected · ${tool.connected_account_email}` : 'Connected'} size="small" onDelete={(ig.credentialFields || ig.authType === 'oauth2') ? (e: React.SyntheticEvent) => { e.stopPropagation(); s.handleDisconnectIntegration(tool.id, ig); } : undefined} onClick={(e) => e.stopPropagation()} sx={{ bgcolor: c.status.successBg, color: c.status.success, fontSize: '0.7rem', height: 22, '& .MuiChip-icon': { color: c.status.success }, '& .MuiChip-deleteIcon': { color: c.status.success, '&:hover': { color: c.status.error } }, flexShrink: 0 }} /></Tooltip>}
                        {ig && !isComingSoon && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>{!!s.integrationLoading[ig.id] && <CircularProgress size={16} sx={{ color: ig.color }} />}<Switch checked={tool.enabled !== false} onChange={() => s.handleIntegrationToggle(ig)} disabled={!!s.integrationLoading[ig.id]} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: ig.color }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: ig.color } }} /></Box>}
                        {!isDisabled && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}><KeyboardArrowDownIcon sx={{ fontSize: 18, color: c.text.ghost, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />{!ig && (<><Tooltip title="Edit" placement="left"><IconButton size="small" onClick={(e) => { e.stopPropagation(); s.openEdit(tool); }} sx={{ color: c.text.ghost, '&:hover': { color: c.accent.primary } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip><Tooltip title="Delete" placement="left"><IconButton size="small" onClick={(e) => { e.stopPropagation(); s.handleDelete(tool.id); }} sx={{ color: c.text.ghost, '&:hover': { color: c.status.error } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip></>)}</Box>}
                      </Box>
                    </CardContent>
                    <Collapse in={isExpanded && !isDisabled}>
                      <Box sx={{ px: 2, pb: 2, pt: 0, borderTop: `1px solid ${c.border.subtle}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><SecurityIcon sx={{ fontSize: 14, color: c.text.muted }} /><Typography sx={{ color: c.text.muted, fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Action Permissions</Typography>{hasPerms && <Chip label={`${totalToolCount} actions`} size="small" sx={{ bgcolor: c.bg.secondary, color: c.text.ghost, fontSize: '0.65rem', height: 18, ml: 0.5 }} />}</Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {hasPerms && (<><Tooltip title="Allow all read-only actions"><Button size="small" onClick={() => s.handleBulkReadOnly(tool.id)} sx={{ color: c.status.info, textTransform: 'none', fontSize: '0.7rem', minWidth: 'auto', px: 1, py: 0.25 }}>Allow reads</Button></Tooltip><Tooltip title="Reset all to Ask"><Button size="small" onClick={() => s.handleResetPermissions(tool.id)} sx={{ color: c.text.ghost, textTransform: 'none', fontSize: '0.7rem', minWidth: 'auto', px: 1, py: 0.25 }}>Reset</Button></Tooltip></>)}
                            <Tooltip title="Discover / refresh actions from MCP server"><IconButton size="small" onClick={() => s.handleDiscover(tool.id)} disabled={s.discovering || !canDiscover} sx={{ color: c.text.ghost, '&:hover': { color: c.accent.primary } }}>{s.discovering ? <CircularProgress size={14} sx={{ color: c.text.ghost }} /> : <RefreshIcon sx={{ fontSize: 16 }} />}</IconButton></Tooltip>
                          </Box>
                        </Box>
                        {!hasPerms ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 1.5 }}><ExtensionIcon sx={{ fontSize: 28, color: c.text.ghost, opacity: 0.4 }} /><Typography sx={{ color: c.text.ghost, fontSize: '0.82rem' }}>No actions discovered yet</Typography><Button size="small" variant="outlined" startIcon={s.discovering ? <CircularProgress size={12} /> : <SearchIcon sx={{ fontSize: 14 }} />} onClick={() => s.handleDiscover(tool.id)} disabled={s.discovering || !canDiscover} sx={{ borderColor: c.border.medium, color: c.text.secondary, '&:hover': { borderColor: c.accent.primary, color: c.accent.primary }, textTransform: 'none', fontSize: '0.78rem', borderRadius: 1.5 }}>Discover Actions</Button>{!canDiscover && <Typography sx={{ color: c.text.ghost, fontSize: '0.72rem' }}>Add an MCP configuration to enable action discovery</Typography>}</Box>
                        ) : (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>{serviceNames.map((svc) => <ServiceGroup key={svc} serviceName={svc} data={services![svc]} toolId={tool.id} perms={perms} descriptions={descriptions} schemas={schemas} expandedServices={s.expandedServices} setExpandedServices={s.setExpandedServices} expandedSchema={s.expandedSchema} setExpandedSchema={s.setExpandedSchema} devMode={s.devMode} onPermissionChange={s.handlePermissionChange} onGroupPermissionChange={s.handleGroupPermissionChange} />)}</Box>
                        )}
                        {s.devMode && isMcp && (
                          <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${c.border.subtle}`, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Typography sx={{ color: c.text.muted, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Developer Info</Typography>
                            <Box sx={{ bgcolor: c.bg.page, borderRadius: 1.5, border: `1px solid ${c.border.subtle}`, px: 1.5, py: 1 }}><Typography sx={{ color: c.text.ghost, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>MCP Config</Typography><Typography component="pre" sx={{ color: c.text.muted, fontSize: '0.75rem', fontFamily: c.font.mono, whiteSpace: 'pre-wrap', wordBreak: 'break-all', m: 0, lineHeight: 1.5 }}>{JSON.stringify(tool.mcp_config, null, 2)}</Typography></Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Typography sx={{ color: c.text.ghost, fontSize: '0.72rem' }}>Auth type:</Typography><Typography sx={{ color: c.text.muted, fontSize: '0.72rem', fontFamily: c.font.mono }}>{tool.auth_type || 'none'}</Typography></Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Typography sx={{ color: c.text.ghost, fontSize: '0.72rem' }}>Status:</Typography><Typography sx={{ color: c.text.muted, fontSize: '0.72rem', fontFamily: c.font.mono }}>{tool.auth_status || 'none'}</Typography></Box>
                              {tool.connected_account_email && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Typography sx={{ color: c.text.ghost, fontSize: '0.72rem' }}>Account:</Typography><Typography sx={{ color: c.text.muted, fontSize: '0.72rem', fontFamily: c.font.mono }}>{tool.connected_account_email}</Typography></Box>}
                            </Box>
                            {tool.credentials && Object.keys(tool.credentials).length > 0 && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}><Typography sx={{ color: c.text.ghost, fontSize: '0.72rem' }}>Credentials:</Typography>{Object.keys(tool.credentials).map((key) => <Chip key={key} label={`${key}: configured`} size="small" sx={{ bgcolor: `${c.status.success}12`, color: c.status.success, fontSize: '0.65rem', height: 18, fontFamily: c.font.mono }} />)}</Box>}
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </Card>
                );
              })}
            </Box>}
        </Collapse>
      </Box>

      <Dialog open={s.dialogOpen} onClose={() => s.setDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: c.bg.surface, backgroundImage: 'none', borderRadius: 4, border: `1px solid ${c.border.subtle}` } }}>
        <DialogTitle sx={{ color: c.text.primary, fontWeight: 600 }}>{s.editingId ? 'Edit Tool' : 'New Tool'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Name" value={s.form.name} onChange={(e) => s.setForm({ ...s.form, name: e.target.value })} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.page } }} />
          <TextField label="Description" value={s.form.description} onChange={(e) => s.setForm({ ...s.form, description: e.target.value })} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.page } }} />
          <TextField label="Command (slash command name)" value={s.form.command} onChange={(e) => s.setForm({ ...s.form, command: e.target.value })} fullWidth size="small" placeholder="e.g. my-tool" sx={{ '& .MuiOutlinedInput-root': { bgcolor: c.bg.page } }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => s.setDialogOpen(false)} sx={{ color: c.text.tertiary, textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={s.handleSave} disabled={!s.form.name} sx={{ bgcolor: c.accent.primary, '&:hover': { bgcolor: c.accent.pressed }, textTransform: 'none', borderRadius: 2 }}>{s.editingId ? 'Save Changes' : 'Create Tool'}</Button>
        </DialogActions>
      </Dialog>

      <RegistryBrowserDialog open={s.registryOpen} onClose={() => s.setRegistryOpen(false)} regQuery={s.regQuery} regServers={s.regServers} regTotal={s.regTotal} regLoading={s.regLoading} regStats={s.regStats} regDetail={s.regDetail} regDetailLoading={s.regDetailLoading} regSort={s.regSort} regSource={s.regSource} expandedServer={s.expandedServer} devMode={s.devMode} allTools={s.allTools} onSearch={s.handleRegSearch} onSort={s.handleRegSort} onSourceFilter={s.handleRegSourceFilter} onLoadMore={s.handleLoadMore} onInstall={s.handleInstall} onEditInstall={s.handleEditInstall} onExpandServer={s.handleExpandServer} />
      <McpConfigDialog open={s.mcpConfigOpen} onClose={() => s.setMcpConfigOpen(false)} mcpConfigServer={s.mcpConfigServer} mcpAuthType={s.mcpAuthType} onAuthTypeChange={s.setMcpAuthType} mcpCredentials={s.mcpCredentials} onCredentialsChange={s.setMcpCredentials} mcpConfigJson={s.mcpConfigJson} onConfigJsonChange={s.setMcpConfigJson} mcpConfigError={s.mcpConfigError} onConfigErrorChange={s.setMcpConfigError} onSave={s.handleMcpConfigSave} />
      <CredentialsDialog open={s.credDialogOpen} onClose={() => s.setCredDialogOpen(false)} integration={s.credDialogIntegration} values={s.credDialogValues} onValuesChange={s.setCredDialogValues} saving={s.credDialogSaving} onSave={s.handleCredentialsSave} />

      <Snackbar open={s.snackbar.open} autoHideDuration={3000} onClose={() => s.setSnackbar({ open: false, message: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => s.setSnackbar({ open: false, message: '' })} severity={s.snackbar.severity || 'success'} sx={{ bgcolor: s.snackbar.severity === 'error' ? '#2e1a1a' : c.status.successBg, color: s.snackbar.severity === 'error' ? '#f87171' : c.status.success, border: `1px solid ${s.snackbar.severity === 'error' ? '#ef444440' : `${c.status.success}40`}` }}>{s.snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Tools;
