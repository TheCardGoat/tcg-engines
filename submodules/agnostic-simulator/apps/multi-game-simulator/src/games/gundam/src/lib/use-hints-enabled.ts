import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "gundam-sim:hints-enabled";

/**
 * Player preference for the playable-card pulse hint. Default ON so
 * new players see the affordance the first few times they play; once
 * they toggle it off, the choice persists across sessions.
 *
 * Stored as `"on"` / `"off"` rather than a boolean so a missing key
 * is unambiguously "never set" → use the default. JSON.parse'ing a
 * boolean would conflate "no value" with "false".
 *
 * The toggle button on the seat plate and the pulse in CardFace are
 * mounted in different subtrees, so a context provider keeps them
 * in sync — separate `useState` per call site would diverge until
 * a remount.
 */
export interface HintsContextValue {
  readonly enabled: boolean;
  readonly toggle: () => void;
}

const HintsContext = createContext<HintsContextValue>({ enabled: true, toggle: () => {} });

function readStored(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "on") return true;
    if (raw === "off") return false;
    return null;
  } catch {
    // localStorage can throw under quota / privacy modes; fall back
    // to the default rather than crashing the whole UI.
    return null;
  }
}

function writeStored(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Same rationale as readStored — best-effort persistence.
  }
}

export function HintsProvider({ children }: { readonly children: ReactNode }) {
  // Initialize to default ON on both server and client; resolve the
  // stored preference post-mount to avoid hydration mismatch when
  // localStorage holds "off".
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = readStored();
    if (stored !== null) setEnabled(stored);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      writeStored(next);
      return next;
    });
  }, []);

  return createElement(HintsContext.Provider, { value: { enabled, toggle } }, children);
}

export function useHintsEnabled(): HintsContextValue {
  return useContext(HintsContext);
}
