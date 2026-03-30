import { type FC, useCallback } from 'react';
import {
  ActionBarPrimitive,
  AuiIf,
  useAui,
} from '@assistant-ui/react';
import {
  CheckIcon,
  CopyIcon,
  GitBranchIcon,
  PencilIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  duplicateSession,
  setActiveSession,
} from '@/shared/state/agentsSlice';
import { useSessionId, useBranchChatCallback } from './OpenSwarmThread';

export const UserActionBar: FC = () => (
  <ActionBarPrimitive.Root
    hideWhenRunning
    autohide="not-last"
    className="aui-user-action-bar-root flex flex-col items-end"
  >
    <ActionBarPrimitive.Edit asChild>
      <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
        <PencilIcon />
      </TooltipIconButton>
    </ActionBarPrimitive.Edit>
  </ActionBarPrimitive.Root>
);

export const AssistantActionBar: FC = () => (
  <ActionBarPrimitive.Root
    hideWhenRunning
    autohide="not-last"
    className="aui-assistant-action-bar-root -ml-1 flex gap-1 text-muted-foreground"
  >
    <ActionBarPrimitive.Copy asChild>
      <TooltipIconButton tooltip="Copy">
        <AuiIf condition={(s) => s.message.isCopied}>
          <CheckIcon />
        </AuiIf>
        <AuiIf condition={(s) => !s.message.isCopied}>
          <CopyIcon />
        </AuiIf>
      </TooltipIconButton>
    </ActionBarPrimitive.Copy>
    <ActionBarPrimitive.Reload asChild>
      <TooltipIconButton tooltip="Regenerate">
        <RefreshCwIcon />
      </TooltipIconButton>
    </ActionBarPrimitive.Reload>
    <BranchChatButton />
  </ActionBarPrimitive.Root>
);

const BranchChatButton: FC = () => {
  const dispatch = useAppDispatch();
  const sessionId = useSessionId();
  const onBranchChat = useBranchChatCallback();
  const aui = useAui();

  const dashboardId = useAppSelector((state) => {
    if (!sessionId) return undefined;
    return state.agents.sessions[sessionId]?.dashboard_id;
  });

  const handleBranchChat = useCallback(async () => {
    if (!sessionId) return;

    let messageId: string | undefined;
    try {
      messageId = aui.message().getState().id;
    } catch {
      return;
    }
    if (!messageId) return;

    const action = await dispatch(
      duplicateSession({
        sessionId,
        dashboardId,
        upToMessageId: messageId,
      }),
    );
    if (duplicateSession.fulfilled.match(action)) {
      if (onBranchChat) onBranchChat(action.payload.id);
      else dispatch(setActiveSession(action.payload.id));
    }
  }, [sessionId, dashboardId, dispatch, aui, onBranchChat]);

  return (
    <TooltipIconButton tooltip="Branch chat" onClick={handleBranchChat}>
      <GitBranchIcon />
    </TooltipIconButton>
  );
};
