import React from 'react';

export interface CredentialField {
  key: string;
  label: string;
  placeholder: string;
  helpText?: string;
  optional?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  mcp_config: Record<string, any>;
  color: string;
  website: string;
  icon: React.ReactNode;
  credentialFields?: CredentialField[];
  connectLabel?: string;
  connectInstructions?: string;
  authType?: 'none' | 'oauth2' | 'env_vars';
  oauthProvider?: string;
  comingSoon?: boolean;
}

export const INTEGRATIONS: Integration[] = [
  { id: 'reddit', name: 'Reddit', description: 'Browse subreddits, search posts, get post details, analyze users.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', 'reddit-mcp-buddy'] },
    color: '#FF4500', website: 'https://github.com/karanb192/reddit-mcp-buddy',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="12" fill="#FF4500"/><path d="M19.5 12c0-.6-.5-1.1-1.1-1.1-.3 0-.6.1-.8.3-1-.7-2.3-1.1-3.7-1.1l.6-3 2.1.5c0 .6.5 1.1 1.1 1.1.6 0 1.1-.5 1.1-1.1 0-.6-.5-1.1-1.1-1.1-.4 0-.8.3-1 .6l-2.3-.5c-.1 0-.2 0-.2.1l-.7 3.3c-1.4 0-2.7.4-3.7 1.1-.2-.2-.5-.3-.8-.3-.6 0-1.1.5-1.1 1.1 0 .4.2.8.6 1-.1.3-.1.6-.1.9 0 2.3 2.6 4.1 5.8 4.1s5.8-1.8 5.8-4.1c0-.3 0-.6-.1-.9.4-.2.6-.6.6-1zm-9.8 1.1c0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1zm6.2 2.9c-.8.8-2 .9-2.9.9s-2.1-.1-2.9-.9c-.1-.1-.1-.3 0-.4.1-.1.3-.1.4 0 .6.6 1.6.8 2.5.8s1.9-.2 2.5-.8c.1-.1.3-.1.4 0 .1.1.1.3 0 .4zm-.2-1.8c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1z" fill="#fff"/></svg>) },
  { id: 'google-workspace', name: 'Google Workspace',
    description: 'Including Google Docs, Sheets, Slides, Calendar, and Gmail. (Gemini CLI extension)',
    mcp_config: { type: 'stdio', command: 'uvx', args: ['--from', 'google-workspace-mcp', 'google-workspace-worker'] },
    color: '#4285F4', website: 'https://developers.google.com/gemini-api/docs/mcp',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>),
    authType: 'oauth2', oauthProvider: 'google' },
  { id: 'sequential-thinking', name: 'Sequential Thinking',
    description: 'Dynamic, reflective problem-solving through structured thought sequences.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-sequential-thinking'] },
    color: '#8B5CF6', website: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#8B5CF6"/><path d="M12 6a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V15h4v-1.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4zm-1 11h2v1h-2z" fill="#fff"/></svg>) },
  { id: 'memory', name: 'Memory',
    description: 'Persistent memory using a local knowledge graph. Entities, relations, and observations.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-memory'] },
    color: '#06B6D4', website: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#06B6D4"/><path d="M12 4C9.2 4 7 6.2 7 9c0 1.9 1 3.5 2.5 4.3V15h5v-1.7C16 12.5 17 10.9 17 9c0-2.8-2.2-5-5-5zm-1.5 13h3v1h-3zm0 2h3v1h-3z" fill="#fff"/></svg>) },
  { id: 'filesystem', name: 'Filesystem',
    description: 'Read, write, search, and manage local files and directories.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '/'] },
    color: '#10B981', website: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#10B981"/><path d="M6 6h5l2 2h5v10H6V6zm2 2v8h8V10h-4l-2-2H8z" fill="#fff"/></svg>) },
  { id: 'playwright', name: 'Playwright',
    description: 'Browser automation — navigate, click, fill forms, take screenshots.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@playwright/mcp'] },
    color: '#2EAD33', website: 'https://github.com/microsoft/playwright-mcp',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#2EAD33"/><path d="M7 8h10v8H7V8zm2 2v4h6v-4H9zm1 1h4v2h-4v-2z" fill="#fff"/></svg>) },
  { id: 'context7', name: 'Context7',
    description: 'Live, up-to-date documentation lookup for libraries and frameworks.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@upstash/context7-mcp@latest'] },
    color: '#00E599', website: 'https://context7.com',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#00E599"/><text x="12" y="16.5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">C7</text></svg>) },
  { id: 'desktop-commander', name: 'Desktop Commander',
    description: 'Terminal commands, file operations, process management, and diff-based editing.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@wonderwhy-er/desktop-commander'] },
    color: '#F59E0B', website: 'https://github.com/wonderwhy-er/DesktopCommanderMCP',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#F59E0B"/><path d="M7 8l4 4-4 4M13 16h4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>) },
  { id: 'git', name: 'Git',
    description: 'Git operations — log, diff, commit, branch, status, and more on local repositories.',
    mcp_config: { type: 'stdio', command: 'uvx', args: ['mcp-server-git'] },
    color: '#F05032', website: 'https://github.com/modelcontextprotocol/servers/tree/main/src/git',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#F05032"/><path d="M12.5 4.5l7 7a.7.7 0 0 1 0 1l-7 7a.7.7 0 0 1-1 0l-7-7a.7.7 0 0 1 0-1l7-7a.7.7 0 0 1 1 0z" fill="none" stroke="#fff" strokeWidth="1.5"/><circle cx="12" cy="12" r="1.5" fill="#fff"/><circle cx="9" cy="9" r="1.2" fill="#fff"/><line x1="10" y1="10" x2="11" y2="11" stroke="#fff" strokeWidth="1"/></svg>) },
  { id: 'youtube-transcripts', name: 'YouTube Transcripts',
    description: 'Fetch transcripts and captions from YouTube videos.', comingSoon: true,
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@kimtaeyoon83/mcp-server-youtube-transcript'] },
    color: '#FF0000', website: 'https://github.com/kimtaeyoon83/mcp-server-youtube-transcript',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#FF0000"/><path d="M9.5 8.5v7l6-3.5z" fill="#fff"/></svg>) },
  { id: 'twitter', name: 'Twitter / X',
    description: 'Fetch tweets, threads, and media from Twitter/X. Read-only.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', 'tweetsave-mcp'] },
    color: '#000000', website: 'https://github.com/zezeron/tweetsave-mcp',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#000"/><text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">&#x1D54F;</text></svg>) },
  { id: 'shopify-dev', name: 'Shopify Dev',
    description: 'Search Shopify docs, explore API schemas, and validate GraphQL queries.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@shopify/dev-mcp@latest'] },
    color: '#96BF48', website: 'https://github.com/Shopify/dev-mcp',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#96BF48"/><path d="M15.5 5.5l-1.2-.7c-.1-.1-.2-.1-.3 0l-.5.3c-.3-.2-.7-.3-1-.4l-.2-.8c0-.1-.1-.2-.3-.2h-1.4c-.1 0-.2.1-.3.2l-.2.8c-.4.1-.7.2-1 .4l-.5-.3c-.1-.1-.2-.1-.3 0L7.1 5.5c-.1.1-.1.2 0 .3l.4.5c-.1.3-.2.6-.2 1H6.5c-.2 0-.3.1-.3.3v1.4c0 .2.1.3.3.3h.8c.1.4.2.7.4 1l-.4.5c-.1.1-.1.2 0 .3l1 1c.1.1.2.1.3 0l.5-.4c.3.2.6.3 1 .4l.1.8c0 .1.1.3.3.3h1.4c.2 0 .3-.1.3-.3l.1-.8c.4-.1.7-.2 1-.4l.5.4c.1.1.2.1.3 0l1-1c.1-.1.1-.2 0-.3l-.4-.5c.2-.3.3-.6.4-1h.8c.2 0 .3-.1.3-.3V7.6c0-.2-.1-.3-.3-.3h-.8c-.1-.4-.2-.7-.4-1l.4-.5c.1-.1.1-.2 0-.3zM11.3 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="#fff" transform="translate(0.7, 3)"/></svg>) },
  { id: 'github', name: 'GitHub',
    description: 'Manage repositories, issues, pull requests, branches, and code search.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-github'] },
    color: '#24292E', website: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#24292E"/><path d="M12 5C8.13 5 5 8.13 5 12c0 3.1 2 5.7 4.8 6.6.35.07.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.03-.78-1.03-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.63 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.94-1.56-.18-3.2-.78-3.2-3.46 0-.76.27-1.39.72-1.88-.07-.18-.31-.89.07-1.85 0 0 .59-.19 1.93.72a6.7 6.7 0 0 1 3.5 0c1.34-.91 1.93-.72 1.93-.72.38.96.14 1.67.07 1.85.45.49.72 1.12.72 1.88 0 2.69-1.64 3.28-3.2 3.45.25.22.48.65.48 1.3v1.93c0 .19.13.41.48.34C17 17.7 19 15.1 19 12c0-3.87-3.13-7-7-7z" fill="#fff"/></svg>),
    authType: 'oauth2', oauthProvider: 'github', connectLabel: 'Connect GitHub' },
  { id: 'slack', name: 'Slack',
    description: 'Send messages, read channels, search conversations, and manage workspaces.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-slack'] },
    color: '#4A154B', website: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#4A154B"/><path d="M9.1 14.1a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 1.2-1.2h1.2v1.2zm.6 0a1.2 1.2 0 1 1 2.4 0v3a1.2 1.2 0 1 1-2.4 0v-3zm1.2-5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 1.2 1.2v1.2H10.9zm0 .6a1.2 1.2 0 1 1 0 2.4h-3a1.2 1.2 0 1 1 0-2.4h3zm5 1.2a1.2 1.2 0 1 1 2.4 0 1.2 1.2 0 0 1-1.2 1.2h-1.2v-1.2zm-.6 0a1.2 1.2 0 1 1-2.4 0v-3a1.2 1.2 0 1 1 2.4 0v3zm-1.2 5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1-1.2-1.2v-1.2h1.2zm0-.6a1.2 1.2 0 1 1 0-2.4h3a1.2 1.2 0 1 1 0 2.4h-3z" fill="#fff"/></svg>),
    authType: 'oauth2', oauthProvider: 'slack', connectLabel: 'Coming Soon', comingSoon: true },
  { id: 'notion', name: 'Notion',
    description: 'Read and write pages, search databases, and manage workspace content.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@notionhq/notion-mcp-server'] },
    color: '#000000', website: 'https://github.com/makenotion/notion-mcp-server',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#000"/><path d="M7.5 6.5h5.8l3.2 3.6v7.4H7.5V6.5zm1.2 1.2v8.6h6.6V10.8l-2.6-3.1H8.7z" fill="#fff"/><path d="M9.5 10h3M9.5 12h5M9.5 14h4" stroke="#fff" strokeWidth="0.7" fill="none"/></svg>),
    authType: 'oauth2', oauthProvider: 'notion', connectLabel: 'Coming Soon', comingSoon: true },
  { id: 'spotify', name: 'Spotify',
    description: 'Control playback, search music, manage playlists, and browse your library.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@tbrgeek/spotify-mcp-server'] },
    color: '#1DB954', website: 'https://github.com/tbrgeek/spotify-mcp-server',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#1DB954"/><path d="M16.5 10.5c-2.5-1.5-6.5-1.6-8.8-.9-.4.1-.8-.1-.9-.5s.1-.8.5-.9c2.7-.8 7.1-.7 9.9 1 .4.2.5.7.3 1-.2.4-.7.5-1 .3zm-.3 2.7c-.2.3-.6.4-.9.2-2.1-1.3-5.3-1.7-7.7-.9-.3.1-.7 0-.8-.4-.1-.3 0-.7.4-.8 2.8-.9 6.3-.4 8.7 1 .3.2.4.6.3.9zm-1 2.6c-.2.2-.5.3-.7.2-1.8-1.1-4.1-1.4-6.8-.7-.3.1-.5-.1-.6-.4s.1-.5.4-.6c3-.7 5.5-.4 7.5.8.3.2.3.5.2.7z" fill="#fff"/></svg>),
    authType: 'oauth2', oauthProvider: 'spotify', connectLabel: 'Coming Soon', comingSoon: true },
  { id: 'figma', name: 'Figma',
    description: 'Access design files, inspect components, and extract design data.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', 'figma-developer-mcp', '--stdio'] },
    color: '#F24E1E', website: 'https://github.com/anthropics/claude-code-mcp-server-figma',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#F24E1E"/><path d="M10.5 6h3v3h-3zm0 3h-3v3h3zm0 3h3v3h-3zm3-3h3v3h-3zm-3 6h-3v1.5a1.5 1.5 0 0 0 3 0V18z" fill="#fff" fillOpacity="0.9"/></svg>),
    authType: 'oauth2', oauthProvider: 'figma', connectLabel: 'Coming Soon', comingSoon: true },
  { id: 'airtable', name: 'Airtable',
    description: 'Read and write records, manage bases, and search structured data.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', 'airtable-mcp-server'] },
    color: '#18BFFF', website: 'https://github.com/domdomegg/airtable-mcp-server',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#18BFFF"/><path d="M6 8h12v2H6zm0 3h5v5H6zm7 0h5v5h-5z" fill="#fff" fillOpacity="0.9"/></svg>),
    authType: 'oauth2', oauthProvider: 'airtable', connectLabel: 'Coming Soon', comingSoon: true },
  { id: 'hubspot', name: 'HubSpot',
    description: 'Manage contacts, deals, companies, and CRM data.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@hubspot/mcp-server'] },
    color: '#FF7A59', website: 'https://github.com/HubSpot/hubspot-mcp-server',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#FF7A59"/><circle cx="12" cy="10.5" r="2.5" fill="none" stroke="#fff" strokeWidth="1.2"/><circle cx="16" cy="13.5" r="1.2" fill="#fff"/><line x1="13.8" y1="11.8" x2="15" y2="13" stroke="#fff" strokeWidth="1"/><path d="M12 13v2.5" stroke="#fff" strokeWidth="1.2"/></svg>),
    authType: 'oauth2', oauthProvider: 'hubspot', connectLabel: 'Coming Soon', comingSoon: true },
  { id: 'discord', name: 'Discord',
    description: 'Manage servers, send messages, and interact with Discord communities.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', 'mcp-discord'] },
    color: '#5865F2', website: 'https://github.com/DiscordMCP/discord-mcp',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#5865F2"/><path d="M15.5 8.5c-1-.5-2-.8-3.1-.9l-.2.4c1.1.2 2 .6 2.9 1.2a10 10 0 0 0-6.2 0c.9-.6 1.8-1 2.9-1.2l-.2-.4c-1.1.1-2.1.4-3.1.9-2 2.9-2.5 5.7-2.2 8.5 1.2.9 2.4 1.4 3.5 1.8.3-.4.5-.8.7-1.2-.4-.1-.7-.3-1-.5l.3-.2c2.2 1 4.6 1 6.8 0l.3.2c-.3.2-.7.4-1 .5.2.4.5.8.7 1.2 1.1-.4 2.3-.9 3.5-1.8.4-3.2-.6-6-2.6-8.5zM9.7 15c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5zm4.6 0c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5z" fill="#fff"/></svg>),
    connectLabel: 'Coming Soon', comingSoon: true,
    connectInstructions: 'Create a Discord bot at discord.com/developers → New Application → Bot, then copy the bot token.',
    credentialFields: [{ key: 'DISCORD_TOKEN', label: 'Bot Token', placeholder: 'Paste your Discord bot token' }] },
  { id: 'zoom', name: 'Zoom',
    description: 'Create, manage, and join Zoom meetings.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@prathamesh0901/zoom-mcp-server'] },
    color: '#2D8CFF', website: 'https://github.com/pras-ops/Zoom_MCP_Server',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#2D8CFF"/><path d="M7 9h6.5c.3 0 .5.2.5.5v5c0 .3-.2.5-.5.5H7c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5zm8 1.5l2.5-1.5v6l-2.5-1.5v-3z" fill="#fff"/></svg>),
    connectLabel: 'Connect Zoom',
    connectInstructions: 'Go to marketplace.zoom.us → Develop → Build App → Server-to-Server OAuth App. Activate it, then copy the Account ID, Client ID, and Client Secret.',
    credentialFields: [
      { key: 'ZOOM_ACCOUNT_ID', label: 'Account ID', placeholder: 'Your Zoom Account ID' },
      { key: 'ZOOM_CLIENT_ID', label: 'Client ID', placeholder: 'Your Zoom Client ID' },
      { key: 'ZOOM_CLIENT_SECRET', label: 'Client Secret', placeholder: 'Your Zoom Client Secret' },
    ] },
  { id: 'microsoft-365', name: 'Microsoft 365',
    description: 'Outlook email, calendar, OneDrive, contacts, Teams, and more. Sign in via the agent when first used.',
    mcp_config: { type: 'stdio', command: 'npx', args: ['-y', '@softeria/ms-365-mcp-server'] },
    color: '#0078D4', website: 'https://github.com/softeria-eu/ms-365-mcp-server',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="#0078D4"/><path d="M6 7h5v5H6V7zm6.5 0H17v5h-4.5V7zM6 13h5v5H6v-5zm6.5 0H17v5h-4.5v-5z" fill="#fff" fillOpacity="0.9"/></svg>) },
];

export const CATEGORY_ORDER = ['filesystem', 'system', 'search', 'interaction', 'agents', 'planning', 'scheduling'];
