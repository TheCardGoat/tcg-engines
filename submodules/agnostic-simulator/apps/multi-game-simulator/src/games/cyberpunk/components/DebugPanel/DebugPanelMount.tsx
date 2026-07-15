import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DebugPanel } from "./DebugPanel";
import classes from "./DebugPanelMount.module.css";

const STORAGE_KEY = "cyberpunk:debugPanel:open";

interface DebugPanelContextValue {
  open: boolean;
  toggle: () => void;
}

const DebugPanelContext = createContext<DebugPanelContextValue | null>(null);

/**
 * Provides open/close state for the dev debug panel and renders the drawer.
 * In production builds the provider is a passthrough — children render but
 * no debug UI is mounted, and {@link DebugPanelToggle} renders nothing.
 */
export function DebugPanelProvider({ children }: { children: ReactNode }) {
  if (!import.meta.env.DEV) {
    return <>{children}</>;
  }
  return <DebugPanelProviderInner>{children}</DebugPanelProviderInner>;
}

function DebugPanelProviderInner({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const value = useMemo<DebugPanelContextValue>(() => ({ open, toggle }), [open, toggle]);

  return (
    <DebugPanelContext.Provider value={value}>
      {children}
      {open && (
        <aside className={classes.drawer} role="dialog" aria-label="Debug panel">
          <header className={classes.drawerHeader}>
            <span className={classes.drawerTitle}>Debug</span>
            <button
              type="button"
              className={classes.drawerClose}
              aria-label="Close debug panel"
              onClick={toggle}
            >
              ✕
            </button>
          </header>
          <DebugPanel />
        </aside>
      )}
    </DebugPanelContext.Provider>
  );
}

/**
 * Toggle button for the debug drawer. Render this anywhere inside a
 * {@link DebugPanelProvider}. Renders nothing in production.
 */
export function DebugPanelToggle() {
  if (!import.meta.env.DEV) {
    return null;
  }
  const ctx = useContext(DebugPanelContext);
  if (!ctx) {
    return null;
  }
  const { open, toggle } = ctx;
  return (
    <button
      type="button"
      className={`${classes.toggle} ${open ? classes.toggleOpen : ""}`}
      aria-pressed={open}
      aria-label={open ? "Close debug panel" : "Open debug panel"}
      onClick={toggle}
    >
      {open ? "✕ DEBUG" : "⌘ DEBUG"}
    </button>
  );
}
