import { AgentMessage } from '@/shared/state/agentsSlice';

export interface OverlayEntry {
  type: 'thought' | 'action' | 'result' | 'skip';
  text: string;
}

export function summarizeMessage(msg: AgentMessage): OverlayEntry {
  if (msg.role === 'assistant' && typeof msg.content === 'string') {
    const trimmed = msg.content.trim();
    if (!trimmed) return { type: 'skip', text: '' };
    return { type: 'thought', text: trimmed };
  }

  if (msg.role === 'tool_call') {
    const content = typeof msg.content === 'string'
      ? (() => { try { return JSON.parse(msg.content); } catch { return {}; } })()
      : msg.content;
    const tool = content?.tool || content?.name || '?';
    const input = content?.input || {};
    let brief = '';
    switch (tool) {
      case 'BrowserNavigate': brief = `Navigate → ${input.url || '...'}`; break;
      case 'BrowserClick': brief = `Click ${input.selector || '...'}`; break;
      case 'BrowserType':
        brief = `Type "${(input.text || '').slice(0, 30)}${(input.text || '').length > 30 ? '…' : ''}" into ${input.selector || '...'}`;
        break;
      case 'BrowserScreenshot': brief = 'Screenshot'; break;
      case 'BrowserGetText': brief = 'Read page text'; break;
      case 'BrowserGetElements':
        brief = `Inspect elements${input.selector ? ` (${input.selector})` : ''}`;
        break;
      case 'BrowserEvaluate': brief = 'Evaluate JS'; break;
      default: brief = tool;
    }
    return { type: 'action', text: brief };
  }

  if (msg.role === 'tool_result') {
    return { type: 'result', text: '' };
  }

  return { type: 'skip', text: '' };
}
