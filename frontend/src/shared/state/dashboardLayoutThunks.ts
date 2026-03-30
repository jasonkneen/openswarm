import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '@/shared/config';
import type { CardPosition, ViewCardPosition, BrowserCardPosition, LayoutPayload, SaveLayoutPayload } from './dashboardLayoutTypes';
import { generateTabId } from './dashboardLayoutTypes';

const DASHBOARDS_API = `${API_BASE}/dashboards`;

export const fetchLayout = createAsyncThunk(
  'dashboardLayout/fetch',
  async (dashboardId: string) => {
    const res = await fetch(`${DASHBOARDS_API}/${dashboardId}`);
    const data = await res.json();
    const layout = data.layout ?? {};
    const browserCards = (layout.browser_cards ?? {}) as Record<string, any>;

    for (const card of Object.values(browserCards)) {
      if (!card.tabs || card.tabs.length === 0) {
        const tabId = generateTabId();
        card.tabs = [{ id: tabId, url: card.url || 'https://www.google.com', title: '' }];
        card.activeTabId = tabId;
      }
      if (!card.url && card.tabs.length > 0) {
        const active = card.tabs.find((t: any) => t.id === card.activeTabId) || card.tabs[0];
        card.url = active.url;
      }
    }

    return {
      cards: (layout.cards ?? {}) as Record<string, CardPosition>,
      viewCards: (layout.view_cards ?? {}) as Record<string, ViewCardPosition>,
      browserCards: browserCards as Record<string, BrowserCardPosition>,
      expandedSessionIds: (layout.expanded_session_ids ?? []) as string[],
    } satisfies LayoutPayload;
  },
);

export const saveLayout = createAsyncThunk(
  'dashboardLayout/save',
  async (payload: SaveLayoutPayload) => {
    await fetch(`${DASHBOARDS_API}/${payload.dashboardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        layout: {
          cards: payload.cards,
          view_cards: payload.viewCards,
          browser_cards: payload.browserCards,
          expanded_session_ids: payload.expandedSessionIds,
        },
      }),
    });
    return payload;
  },
);
