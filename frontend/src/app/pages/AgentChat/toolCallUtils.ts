import { AgentMessage } from '@/shared/state/agentsSlice';

export interface ToolPair { type: 'tool_pair'; id: string; call: AgentMessage; result: AgentMessage | null; }
export interface McpToolInfo { isMcp: boolean; serverSlug: string; action: string; service: string; displayName: string; }
export interface ParsedBashResult { type: 'bash'; stdout: string; stderr: string; exitCode: number | null; }
export interface ParsedTextResult { type: 'text'; content: string; isError?: boolean; }
export interface ParsedMcpResult { type: 'mcp'; service: string; action: string; data: Record<string, any>; rawText: string; }
export type ParsedResult = ParsedBashResult | ParsedTextResult | ParsedMcpResult;
export interface ToolCallBubbleProps {
  call: AgentMessage; result?: AgentMessage | null; isPending?: boolean;
  isStreaming?: boolean; mcpCompact?: boolean; sessionId?: string;
}
export interface InvokeAgentParsed { agentName: string; sessionId: string | null; cost: string | null; response: string; }

let toolCallKeyframesInjected = false;
export function ensureToolCallKeyframes() {
  if (toolCallKeyframesInjected) return;
  toolCallKeyframesInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-tool-call-keyframes', '');
  style.textContent = `
@keyframes tool-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes border-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(var(--glow-rgb), 0); } 50% { box-shadow: 0 0 10px 2px rgba(var(--glow-rgb), 0.12); } }
@keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
  document.head.appendChild(style);
}
export function formatElapsed(ms: number): string {
  if (ms >= 60000) return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}
export function getToolData(call: AgentMessage) {
  const content = typeof call.content === 'object' ? call.content : {};
  return { toolName: content.tool || 'Unknown', input: content.input || {}, isDenied: content.approved === false, toolId: content.id };
}
export function isBashTool(name: string) { return name === 'Bash' || name === 'bash'; }

export function parseMcpToolName(rawName: string): McpToolInfo {
  const m = rawName.match(/^mcp__([^_]+(?:-[^_]+)*)__(.+)$/);
  if (!m) return { isMcp: false, serverSlug: '', action: '', service: '', displayName: rawName };
  const serverSlug = m[1], action = m[2];
  const display = action.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
  const lower = action.toLowerCase();
  let service = '';
  if (lower.includes('gmail') || lower.includes('email') || lower.includes('mail')) service = 'gmail';
  else if (lower.includes('calendar') || lower.includes('event') || lower.includes('freebusy')) service = 'calendar';
  else if (lower.includes('drive') || lower.includes('file')) service = 'drive';
  else if (lower.includes('sheet') || lower.includes('spreadsheet')) service = 'sheets';
  else if (lower.includes('doc') || lower.includes('paragraph')) service = 'docs';
  else if (lower.includes('contact')) service = 'contacts';
  return { isMcp: true, serverSlug, action, service, displayName: display };
}

export function getInputSummary(toolName: string, input: any): string {
  try {
    const mcp = parseMcpToolName(toolName);
    if (mcp.isMcp) {
      if (!input || typeof input !== 'object') return '';
      const keys = Object.keys(input);
      if (keys.length === 0) return '';
      if (keys.length === 1) { const v = input[keys[0]], s = typeof v === 'string' ? v : JSON.stringify(v); return s.length > 60 ? s.slice(0, 60) + '…' : s; }
      return keys.slice(0, 3).map((k) => { const v = input[k], s = typeof v === 'string' ? v : JSON.stringify(v); return `${k}: ${s.length > 30 ? s.slice(0, 30) + '…' : s}`; }).join('  ');
    }
    const n = toolName.toLowerCase();
    if (isBashTool(toolName)) { const cmd = input.command || ''; return `$ ${cmd.slice(0, 80)}${cmd.length > 80 ? '…' : ''}`; }
    if (n === 'read' || n === 'write') return input.file_path || input.path || '';
    if (n === 'edit' || n === 'multiedit' || n === 'strreplace') return input.file_path || input.path || '';
    if (n === 'glob') return input.pattern || input.glob || input.glob_pattern || '';
    if (n === 'grep' || n === 'ripgrep') {
      const pat = input.pattern || input.regex || '', path = input.path || input.directory || '';
      return path ? `/${pat}/ in ${path}` : `/${pat}/`;
    }
    if (n === 'websearch') return input.query || input.search_term || '';
    if (n === 'webfetch') return input.url || '';
    if (n === 'todoread' || n === 'todowrite') return 'todos';
    if (n === 'ls') return input.path || '.';
    return '';
  } catch { return ''; }
}
export function formatInputDisplay(toolName: string, input: any): string {
  try {
    const mcp = parseMcpToolName(toolName);
    if (mcp.isMcp) {
      if (!input || typeof input !== 'object') return String(input ?? '');
      return Object.entries(input).map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v, null, 2)}`).join('\n');
    }
    const n = toolName.toLowerCase();
    if (isBashTool(toolName)) return input.command || '';
    if (n === 'read') {
      const p = input.file_path || input.path || '', parts = [p];
      if (input.offset) parts.push(`offset: ${input.offset}`);
      if (input.limit) parts.push(`limit: ${input.limit}`);
      return parts.join('  ');
    }
    if (n === 'write') {
      const p = input.file_path || input.path || '', c = input.content || '';
      return `${p}\n\n${c.length > 300 ? c.slice(0, 300) + '\n…' : c}`;
    }
    if (n === 'edit' || n === 'strreplace') {
      const p = input.file_path || input.path || '', old = input.old_string || input.old_text || '', nw = input.new_string || input.new_text || '';
      const lines = [p, ''];
      if (old) { const o = old.length > 200 ? old.slice(0, 200) + '…' : old; lines.push(`- ${o.split('\n').join('\n- ')}`); }
      if (nw) { const n2 = nw.length > 200 ? nw.slice(0, 200) + '…' : nw; lines.push(`+ ${n2.split('\n').join('\n+ ')}`); }
      return lines.join('\n');
    }
    if (n === 'multiedit') {
      const edits = input.edits || [], lines = [input.file_path || input.path || ''];
      for (const e of edits.slice(0, 3)) lines.push(`  - ${(e.old_string || e.old_text || '').split('\n')[0].slice(0, 60)}…`);
      if (edits.length > 3) lines.push(`  … +${edits.length - 3} more edits`);
      return lines.join('\n');
    }
    if (n === 'glob') return input.pattern || input.glob || input.glob_pattern || '';
    if (n === 'grep' || n === 'ripgrep') {
      const pat = input.pattern || input.regex || '', path = input.path || input.directory || '';
      const parts = [`pattern: ${pat}`];
      if (path) parts.push(`path: ${path}`);
      if (input.include) parts.push(`include: ${input.include}`);
      return parts.join('\n');
    }
    if (n === 'websearch') return input.query || input.search_term || '';
    if (n === 'webfetch') return input.url || '';
  } catch {}
  return typeof input === 'string' ? input : JSON.stringify(input, null, 2);
}
export function parseToolResult(toolName: string, rawText: string): ParsedResult {
  if (isBashTool(toolName)) {
    try {
      const p = JSON.parse(rawText);
      if (typeof p === 'object' && p !== null && 'stdout' in p) {
        const em = (p.stdout || '').match(/[Ee]xit code:\s*(\d+)/);
        return { type: 'bash', stdout: p.stdout || '', stderr: p.stderr || '', exitCode: em ? parseInt(em[1], 10) : null };
      }
    } catch {}
  }
  const mcp = parseMcpToolName(toolName);
  if (mcp.isMcp) {
    try {
      let p = JSON.parse(rawText);
      if (Array.isArray(p) && p.some((b: any) => b?.type === 'text' && typeof b?.text === 'string')) {
        const tc = p.filter((b: any) => b?.type === 'text').map((b: any) => b.text).join('\n');
        try { p = JSON.parse(tc); } catch { return { type: 'mcp', service: mcp.service, action: mcp.action, data: {}, rawText: tc }; }
      }
      if (typeof p === 'object' && p !== null) return { type: 'mcp', service: mcp.service, action: mcp.action, data: p, rawText };
    } catch {}
    return { type: 'mcp', service: mcp.service, action: mcp.action, data: {}, rawText };
  }
  try {
    const p = JSON.parse(rawText);
    if (typeof p === 'object' && p !== null) {
      if ('stdout' in p) return { type: 'text', content: p.stdout || '' };
      if ('content' in p && typeof p.content === 'string') return { type: 'text', content: p.content, isError: !!p.is_error };
      if ('result' in p && typeof p.result === 'string') return { type: 'text', content: p.result };
      if ('output' in p && typeof p.output === 'string') return { type: 'text', content: p.output };
      if (toolName.toLowerCase() === 'glob' && Array.isArray(p)) return { type: 'text', content: p.join('\n') };
    }
  } catch {}
  return { type: 'text', content: rawText };
}
export function getMcpShortAction(mcpInfo: McpToolInfo): string {
  let short = mcpInfo.action;
  if (mcpInfo.service && short.toLowerCase().startsWith(mcpInfo.service.toLowerCase() + '_')) short = short.slice(mcpInfo.service.length + 1);
  return short.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}
export function getGmailHeader(msg: any, name: string): string {
  if (msg.payload?.headers && Array.isArray(msg.payload.headers)) { const h = msg.payload.headers.find((hdr: any) => (hdr.name || '').toLowerCase() === name.toLowerCase()); if (h) return h.value || ''; }
  if (msg.headers && typeof msg.headers === 'object' && !Array.isArray(msg.headers)) return msg.headers[name] || msg.headers[name.toLowerCase()] || '';
  return '';
}
export function getResultSummary(toolName: string, rawText: string): string {
  const parsed = parseToolResult(toolName, rawText);
  if (parsed.type === 'bash') {
    const lc = parsed.stdout.split('\n').filter((l) => l.trim()).length;
    if (parsed.exitCode !== null && parsed.exitCode !== 0) return `✗ exit ${parsed.exitCode}`;
    if (parsed.stderr && !parsed.stdout) return '✗ stderr';
    return `✓ ${lc} line${lc !== 1 ? 's' : ''}`;
  }
  if (parsed.type === 'mcp') {
    const d = parsed.data;
    if (parsed.service === 'gmail') { const subj = d.subject || getGmailHeader(d, 'Subject'); if (subj) return subj; if (Array.isArray(d.messages)) return `${d.messages.length} email${d.messages.length !== 1 ? 's' : ''}`; if (d.id || d.messageId) return '✓ done'; }
    if (parsed.service === 'calendar') { if (d.summary) return d.summary.slice(0, 40); if (Array.isArray(d.items)) return `${d.items.length} event${d.items.length !== 1 ? 's' : ''}`; }
    if (parsed.service === 'drive') { if (d.name) return d.name; if (Array.isArray(d.files)) return `${d.files.length} file${d.files.length !== 1 ? 's' : ''}`; }
    if (d.error || d.is_error) return '✗ error';
    return '✓ done';
  }
  const text = parsed.content, lines = text.split('\n'), lc = lines.length, n = toolName.toLowerCase();
  try {
    if (n === 'glob') { const fc = lines.filter((l) => l.trim()).length; return `${fc} file${fc !== 1 ? 's' : ''}`; }
    if (n === 'grep' || n === 'ripgrep') { const mc = lines.filter((l) => l.trim()).length; return `${mc} match${mc !== 1 ? 'es' : ''}`; }
    if (n === 'read') return `${lc} lines`;
    if (n === 'write') return text.toLowerCase().includes('success') || text.toLowerCase().includes('written') ? '✓ written' : '✓ done';
    if (n === 'edit' || n === 'multiedit' || n === 'strreplace') return text.toLowerCase().includes('success') || text.toLowerCase().includes('applied') ? '✓ applied' : '✓ done';
    if (n === 'websearch') return 'results';
    if (n === 'webfetch') return `${lc} lines`;
    if (parsed.isError) return '✗ error';
  } catch {}
  return `${lc} line${lc !== 1 ? 's' : ''}`;
}
export function getPromptPrefix(toolName: string): string {
  if (isBashTool(toolName)) return '$ ';
  const mcp = parseMcpToolName(toolName);
  return mcp.isMcp ? `❯ ${mcp.displayName} ` : `❯ ${toolName} `;
}
export function formatTimestamp(ts: string | number | undefined): string {
  if (!ts) return '';
  try {
    const d = typeof ts === 'number' ? new Date(ts) : new Date(ts);
    if (isNaN(d.getTime())) return String(ts);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch { return String(ts); }
}
export function stripHtml(html: string): string {
  const tmp = document.createElement('div'); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || '';
}
export function isBrowserAgentTool(name: string): boolean {
  if (name === 'CreateBrowserAgent' || name === 'BrowserAgent' || name === 'BrowserAgents') return true;
  const m = parseMcpToolName(name); return m.isMcp && m.serverSlug === 'openswarm-browser-agent';
}
export function isInvokeAgentTool(name: string): boolean {
  if (name === 'InvokeAgent') return true;
  const m = parseMcpToolName(name); return m.isMcp && m.serverSlug === 'openswarm-invoke-agent';
}
export function isCreateAgentTool(name: string): boolean { return name === 'Agent'; }
export function parseInvokedSessionId(rawText: string): string | null { return rawText.match(/\(forked session:\s*([a-f0-9]+)\)/)?.[1] || null; }
export function parseCreateAgentResult(rawText: string): string {
  if (!rawText) return '';
  try {
    const p = JSON.parse(rawText);
    if (typeof p === 'string') return p;
    if (typeof p === 'object' && p !== null) {
      if (p.text) return p.text;
      if (p.content) return typeof p.content === 'string' ? p.content : JSON.stringify(p.content);
      if (p.result) return typeof p.result === 'string' ? p.result : JSON.stringify(p.result);
    }
  } catch {}
  return rawText;
}
export function parseInvokeAgentResult(rawText: string): InvokeAgentParsed | null {
  const hm = rawText.match(/\*\*Invoked Agent Result\*\*(?:\s*—\s*(.+?))?\s*\(forked session:\s*([a-f0-9]+)\)/);
  if (!hm) return null;
  const agentName = hm[1]?.trim() || 'Agent', sessionId = hm[2];
  const costMatch = rawText.match(/\*Cost:\s*\$([0-9.]+)\*/);
  const cost = costMatch ? costMatch[1] : null;
  const bodyStart = rawText.indexOf('\n\n');
  let response = bodyStart >= 0 ? rawText.slice(bodyStart + 2).trim() : '';
  if (response.startsWith('*Cost:')) {
    const ac = response.indexOf('\n');
    response = ac >= 0 ? response.slice(ac + 1).trim() : '';
  }
  return { agentName, sessionId, cost, response };
}
