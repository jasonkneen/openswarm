import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './dashboardLayoutTypes';
import { dashboardLayoutReducers } from './dashboardLayoutReducers';
import { fetchLayout } from './dashboardLayoutThunks';
import { launchAndSendFirstMessage } from './agentsSlice';

const dashboardLayoutSlice = createSlice({
  name: 'dashboardLayout',
  initialState,
  reducers: dashboardLayoutReducers,
  extraReducers: (builder) => {
    builder
      .addCase(fetchLayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLayout.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.cards = action.payload.cards;
        state.viewCards = action.payload.viewCards;
        state.browserCards = action.payload.browserCards;
        state.persistedExpandedSessionIds = action.payload.expandedSessionIds;

        let maxZ = 0;
        for (const c of Object.values(state.cards)) {
          if (!c.zOrder) c.zOrder = 0;
          if (c.zOrder > maxZ) maxZ = c.zOrder;
        }
        for (const c of Object.values(state.viewCards)) {
          if (!c.zOrder) c.zOrder = 0;
          if (c.zOrder > maxZ) maxZ = c.zOrder;
        }
        for (const c of Object.values(state.browserCards)) {
          if (!c.zOrder) c.zOrder = 0;
          if (c.zOrder > maxZ) maxZ = c.zOrder;
        }
        state.nextZOrder = maxZ + 1;
      })
      .addCase(fetchLayout.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(launchAndSendFirstMessage.fulfilled, (state, action) => {
        const { draftId, session } = action.payload;
        const card = state.cards[draftId];
        if (card) {
          delete state.cards[draftId];
          state.cards[session.id] = { ...card, session_id: session.id, zOrder: state.nextZOrder++ };
        }
      });
  },
});

export const {
  setCardPosition, placeCard, setCardSize, removeCard, bringToFront,
  reconcileSessions, replaceDraftId, tidyLayout,
  addViewCard, setViewCardPosition, setViewCardSize, removeViewCard,
  addBrowserCard, addBrowserCardFromBackend, setBrowserCardPosition,
  setBrowserCardSize, removeBrowserCard, pasteBrowserCard,
  updateBrowserCardUrl, addBrowserTab, removeBrowserTab,
  setActiveBrowserTab, updateBrowserTabUrl, updateBrowserTabTitle,
  updateBrowserTabFavicon, reorderBrowserTab, moveCards,
  setGlowingBrowserCards, fadeGlowingBrowserCards,
  clearGlowingBrowserCards, clearAllGlowingBrowserCards,
  setGlowingAgentCard, fadeGlowingAgentCard, clearGlowingAgentCard,
  resetLayout,
} = dashboardLayoutSlice.actions;

export default dashboardLayoutSlice.reducer;

export * from './dashboardLayoutTypes';
export * from './dashboardLayoutThunks';
