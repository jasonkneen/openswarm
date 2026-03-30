import { McpServer } from '@/shared/state/mcpRegistrySlice';
import { BuiltinTool } from '@/shared/state/toolsSlice';

export interface ToolForm {
  name: string;
  description: string;
  command: string;
}

export const emptyForm: ToolForm = {
  name: '',
  description: '',
  command: '',
};

export function cleanServerName(name: string): string {
  const parts = name.split('/');
  return parts[parts.length - 1];
}

export function serverToToolForm(srv: McpServer): ToolForm {
  return {
    name: srv.title || cleanServerName(srv.name),
    description: srv.description,
    command: '',
  };
}

export function serverToMcpConfig(srv: McpServer): Record<string, any> {
  if (srv.remoteUrl) {
    return { type: srv.remoteType === 'sse' ? 'sse' : 'http', url: srv.remoteUrl };
  }
  if (srv.repositoryUrl && srv.repositoryUrl.includes('github.com')) {
    const match = srv.repositoryUrl.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?(?:\/|$)/);
    if (match) {
      return { type: 'stdio', command: 'npx', args: ['-y', `github:${match[1]}`] };
    }
  }
  return {};
}

export function groupTools(list: BuiltinTool[]): Record<string, BuiltinTool[]> {
  const g: Record<string, BuiltinTool[]> = {};
  for (const bt of list) {
    if (!g[bt.category]) g[bt.category] = [];
    g[bt.category].push(bt);
  }
  return g;
}
