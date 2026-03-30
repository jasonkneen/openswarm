/**
 * Re-export stub — logic moved to toolkit/approval-tools.tsx.
 * Kept for backward compatibility with AgentChat, DynamicIsland, and Dashboard imports.
 */
export { ApprovalRouter as default } from './toolkit/approval-tools';
export { ToolQuestion as QuestionForm } from './toolkit/approval-tools';
export type { ToolQuestionProps as QuestionFormProps } from './toolkit/approval-tools';
export { BatchApprovalWrapper as BatchApprovalBar } from './toolkit/approval-tools';
export { parseMcpToolName, useMcpToolMeta, getToolIcon } from './toolkit/approval-tools';
export type { ParsedTool } from './toolkit/approval-tools';
