import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './agentsTypes';
import { agentsReducers } from './agentsReducers';
import { buildExtraReducers } from './agentsExtraReducers';

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: agentsReducers,
  extraReducers: buildExtraReducers,
});

export const {
  createDraftSession,
  setActiveSession,
  toggleExpandSession,
  expandSession,
  collapseSession,
  collapseAllSessions,
  setExpandedSessionIds,
  updateSessionName,
  updateGroupMeta,
  setDraftSystemPrompt,
  updateSession,
  updateSessionStatus,
  addMessage,
  streamStart,
  streamDelta,
  streamEnd,
  addApprovalRequest,
  removeApprovalRequest,
  updateSessionCost,
  addBranch,
  setActiveBranch,
  updateSessionProvider,
  updateSessionModel,
  updateSessionMode,
  closeSessionFromWs,
  removeDraftSession,
  clearHistorySearch,
  trackAgentNotification,
  dismissAgentNotification,
  dismissAllFinishedNotifications,
} = agentsSlice.actions;

export default agentsSlice.reducer;

export * from './agentsTypes';
export * from './agentsThunks';
