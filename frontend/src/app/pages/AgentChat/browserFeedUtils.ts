import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import type { AgentMessage } from '@/shared/state/agentsSlice';

export interface FeedEntry {
  type: 'thought' | 'action' | 'result' | 'system';
  text: string;
  actionTool?: string;
  sessionLabel?: string;
}

export interface FeedColors {
  thought: string;
  thoughtIcon: string;
  result: string;
  error: string;
  errorIcon: string;
  scrollThumb: string;
}

export const darkFeedColors: FeedColors = {
  thought: '#a0aab8',
  thoughtIcon: '#555b6e',
  result: '#555b6e',
  error: '#ff8787',
  errorIcon: '#ff8787',
  scrollThumb: '#2a2d3e',
};

export const lightFeedColors: FeedColors = {
  thought: '#555550',
  thoughtIcon: '#9e9c95',
  result: '#9e9c95',
  error: '#c03030',
  errorIcon: '#c03030',
  scrollThumb: '#ccc9c0',
};

export function formatMessage(msg: AgentMessage): FeedEntry | null {
  if (msg.role === 'user') return null;

  if (msg.role === 'assistant' && typeof msg.content === 'string') {
    const trimmed = msg.content.trim();
    if (!trimmed) return null;
    return { type: 'thought', text: trimmed };
  }

  if (msg.role === 'tool_call') {
    const content =
      typeof msg.content === 'string'
        ? (() => { try { return JSON.parse(msg.content); } catch { return {}; } })()
        : msg.content;
    const tool = content?.tool || content?.name || '?';
    const input = content?.input || {};
    let brief = '';
    switch (tool) {
      case 'BrowserNavigate':
        brief = `Navigate → ${input.url || '...'}`;
        break;
      case 'BrowserClick':
        brief = `Click ${input.selector || '...'}`;
        break;
      case 'BrowserType': {
        const txt = (input.text || '').slice(0, 40);
        const ellipsis = (input.text || '').length > 40 ? '…' : '';
        brief = `Type "${txt}${ellipsis}" into ${input.selector || '...'}`;
        break;
      }
      case 'BrowserScreenshot':
        brief = 'Screenshot';
        break;
      case 'BrowserGetText':
        brief = 'Read page text';
        break;
      case 'BrowserGetElements':
        brief = `Inspect elements${input.selector ? ` (${input.selector})` : ''}`;
        break;
      case 'BrowserEvaluate':
        brief = `Evaluate JS`;
        break;
      default:
        brief = `${tool}(${JSON.stringify(input).slice(0, 60)})`;
    }
    return { type: 'action', text: brief, actionTool: tool };
  }

  if (msg.role === 'tool_result') {
    const content =
      typeof msg.content === 'string'
        ? (() => { try { return JSON.parse(msg.content); } catch { return { text: msg.content }; } })()
        : msg.content;
    const toolName = content?.tool_name || '';
    const elapsed = content?.elapsed_ms;
    const text = content?.text || '';

    if (toolName === 'BrowserScreenshot') {
      return { type: 'result', text: `Screenshot captured${elapsed ? ` (${elapsed}ms)` : ''}` };
    }
    const preview = text.length > 120 ? text.slice(0, 120) + '…' : text;
    return { type: 'result', text: `${preview}${elapsed ? ` (${elapsed}ms)` : ''}` };
  }

  if (msg.role === 'system') {
    return { type: 'system', text: typeof msg.content === 'string' ? msg.content : '' };
  }

  return null;
}

export type SvgIconComponent = typeof OpenInNewIcon;

export function getActionIcon(tool?: string): SvgIconComponent {
  switch (tool) {
    case 'BrowserNavigate': return OpenInNewIcon;
    case 'BrowserClick': return TouchAppOutlinedIcon;
    case 'BrowserType': return KeyboardOutlinedIcon;
    case 'BrowserScreenshot': return CameraAltOutlinedIcon;
    case 'BrowserGetText': return ArticleOutlinedIcon;
    case 'BrowserGetElements': return AccountTreeOutlinedIcon;
    case 'BrowserEvaluate': return CodeOutlinedIcon;
    default: return BuildOutlinedIcon;
  }
}
