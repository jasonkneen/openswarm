import type { Toolkit } from '@assistant-ui/react';
import { nativeToolkit } from './native-tools';
import { approvalToolkit } from './approval-tools';
import { customToolkit } from './custom-tools';

export const toolkit = {
  ...nativeToolkit,
  ...approvalToolkit,
  ...customToolkit,
} as Toolkit;
