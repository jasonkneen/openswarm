import type { Toolkit } from '@assistant-ui/react';
import { nativeToolkit } from './native-tools';
import { approvalToolkit } from './approval-tools';
import { mcpToolkit } from './mcp-tools';
import { customToolkit } from './custom-tools';

export const toolkit: Toolkit = {
  ...nativeToolkit,
  ...approvalToolkit,
  ...mcpToolkit,
  ...customToolkit,
};
