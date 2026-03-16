import { useState, useEffect, useRef, useCallback } from 'react';
import {
  subscribeActivity,
  getActivity,
  type BrowserActivity,
  type BrowserAction,
} from './browserCommandHandler';

export interface BrowserActivityState {
  active: boolean;
  action: BrowserAction | null;
  detail: string | null;
  /** The action that just completed — stays set briefly for exit animations */
  lastAction: BrowserAction | null;
}

const EMPTY: BrowserActivityState = { active: false, action: null, detail: null, lastAction: null };

export function useBrowserActivity(browserId: string): BrowserActivityState {
  const [state, setState] = useState<BrowserActivityState>(() => {
    const current = getActivity(browserId);
    return current
      ? { active: true, action: current.action, detail: current.detail ?? null, lastAction: null }
      : EMPTY;
  });

  const lastActionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (changedId: string, activity: BrowserActivity | null) => {
      if (changedId !== browserId) return;
      if (activity) {
        if (lastActionTimer.current) clearTimeout(lastActionTimer.current);
        setState({
          active: true,
          action: activity.action,
          detail: activity.detail ?? null,
          lastAction: null,
        });
      } else {
        setState((prev) => ({
          active: false,
          action: null,
          detail: null,
          lastAction: prev.action,
        }));
        lastActionTimer.current = setTimeout(() => {
          setState((prev) => (prev.active ? prev : { ...prev, lastAction: null }));
        }, 600);
      }
    },
    [browserId],
  );

  useEffect(() => {
    return subscribeActivity(handleChange);
  }, [handleChange]);

  useEffect(() => {
    return () => {
      if (lastActionTimer.current) clearTimeout(lastActionTimer.current);
    };
  }, []);

  return state;
}
