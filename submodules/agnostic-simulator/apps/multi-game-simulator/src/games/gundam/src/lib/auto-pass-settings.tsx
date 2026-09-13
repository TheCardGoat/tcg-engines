import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { apiUrl } from "../../../../runtime/gameRuntimeApi.ts";
import {
  useSimulatorAuth,
  useSimulatorUserSettings,
} from "../../../../simulator/providers/index.ts";

export const AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY =
  "matchmaking.gundam.autoPassWhenNoValidAction";
export const DEFAULT_AUTO_PASS_WHEN_NO_VALID_ACTION = true;

interface GundamSettingsResponse {
  readonly gameSettings?: {
    readonly gundam?: {
      readonly simulator?: {
        readonly autoPassWhenNoValidAction?: boolean;
      };
    };
  };
}

export interface AutoPassWhenNoValidActionContextValue {
  readonly enabled: boolean;
  readonly ready: boolean;
  readonly setEnabled: (enabled: boolean) => void;
}

export const GundamAutoPassSettingsContext = createContext<AutoPassWhenNoValidActionContextValue>({
  enabled: DEFAULT_AUTO_PASS_WHEN_NO_VALID_ACTION,
  ready: false,
  setEnabled: () => undefined,
});

const SAVE_DEBOUNCE_MS = 500;

export function readStoredAutoPassWhenNoValidAction(storage: Storage): boolean | null {
  try {
    const stored = storage.getItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY);
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {
    // Browser storage is best-effort; the default remains usable in privacy modes.
  }
  return null;
}

export function resolveAutoPassWhenNoValidAction(
  serverValue: boolean | undefined,
  storedValue: boolean | null,
): boolean {
  return serverValue ?? storedValue ?? DEFAULT_AUTO_PASS_WHEN_NO_VALID_ACTION;
}

function writeStoredAutoPassWhenNoValidAction(storage: Storage, enabled: boolean): void {
  try {
    storage.setItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Browser storage is best-effort; the in-memory setting still applies.
  }
}

function readBrowserStoredValue(): boolean | null {
  if (typeof window === "undefined") return null;
  return readStoredAutoPassWhenNoValidAction(window.localStorage);
}

/**
 * Live matches submit automatic priority passes to the server. Authenticated
 * players must not auto-pass from the default/localStorage value before their
 * account setting has loaded — otherwise a saved "off" can lose a race with
 * the first Block/Action window. Anonymous and local simulator play still
 * become ready immediately from browser storage.
 */
function isReadyWithoutServerValue(isAuthenticated: boolean): boolean {
  return !isAuthenticated && typeof window !== "undefined";
}

export function AutoPassWhenNoValidActionProvider({ children }: { readonly children: ReactNode }) {
  const auth = useSimulatorAuth();
  const { viewerSettings } = useSimulatorUserSettings();
  const serverValue = viewerSettings?.gameSettings.gundam?.simulator?.autoPassWhenNoValidAction;
  const [state, setState] = useState(() => {
    const stored = readBrowserStoredValue();
    return {
      enabled: resolveAutoPassWhenNoValidAction(serverValue, stored),
      ready: serverValue !== undefined || isReadyWithoutServerValue(auth.isAuthenticated),
    };
  });
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedUserRef = useRef<string | null>(serverValue === undefined ? null : auth.userId);
  const editVersionRef = useRef(0);

  const persistLocal = useCallback((enabled: boolean) => {
    if (typeof window !== "undefined") {
      writeStoredAutoPassWhenNoValidAction(window.localStorage, enabled);
    }
  }, []);

  const clearPendingSave = useCallback(() => {
    if (saveTimerRef.current === null) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
  }, []);

  const applyResolvedPreference = useCallback(
    (value: boolean | undefined, userId: string | null) => {
      hydratedUserRef.current = userId;
      const enabled = resolveAutoPassWhenNoValidAction(value, readBrowserStoredValue());
      setState({ enabled, ready: true });
      if (value !== undefined) {
        persistLocal(value);
      }
    },
    [persistLocal],
  );

  // Canonical account settings from the shared user-settings context win
  // immediately when present.
  useEffect(() => {
    if (serverValue === undefined) return;
    applyResolvedPreference(serverValue, auth.userId);
  }, [applyResolvedPreference, auth.userId, serverValue]);

  // Anonymous / local: use browser storage as soon as we are in a browser.
  useEffect(() => {
    if (auth.isAuthenticated || serverValue !== undefined) return;
    if (typeof window === "undefined") return;
    setState((current) => {
      if (current.ready) return current;
      return {
        enabled: resolveAutoPassWhenNoValidAction(undefined, readBrowserStoredValue()),
        ready: true,
      };
    });
  }, [auth.isAuthenticated, serverValue]);

  // Authenticated without a context value: fetch the account preference before
  // marking ready so auto-pass cannot fire on the default while hydration is
  // in flight. Failures still become ready from browser storage so play is not
  // stuck forever.
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.userId || serverValue !== undefined) return;
    if (hydratedUserRef.current === auth.userId) return;

    setState((current) => (current.ready ? { ...current, ready: false } : current));

    const hydrationEditVersion = editVersionRef.current;
    const controller = new AbortController();
    const userId = auth.userId;

    void fetch(apiUrl("platform", "/users/me/settings"), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return undefined;
        const body = (await response.json()) as GundamSettingsResponse;
        return body.gameSettings?.gundam?.simulator?.autoPassWhenNoValidAction;
      })
      .then((remoteValue) => {
        if (controller.signal.aborted) return;
        if (editVersionRef.current !== hydrationEditVersion) return;
        applyResolvedPreference(remoteValue, userId);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (editVersionRef.current !== hydrationEditVersion) return;
        console.error("[gundam-auto-pass] Failed to hydrate setting:", error);
        applyResolvedPreference(undefined, userId);
      });

    return () => controller.abort();
  }, [applyResolvedPreference, auth.isAuthenticated, auth.userId, serverValue]);

  const setEnabled = useCallback(
    (enabled: boolean) => {
      editVersionRef.current += 1;
      setState({ enabled, ready: true });
      persistLocal(enabled);
      clearPendingSave();
      if (!auth.isAuthenticated) return;
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        void fetch(apiUrl("platform", "/users/me/settings"), {
          method: "PUT",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            gameSettings: {
              gundam: {
                simulator: { autoPassWhenNoValidAction: enabled },
              },
            },
          }),
        }).catch((error: unknown) => {
          console.error("[gundam-auto-pass] Failed to save setting:", error);
        });
      }, SAVE_DEBOUNCE_MS);
    },
    [auth.isAuthenticated, clearPendingSave, persistLocal],
  );

  useEffect(() => () => clearPendingSave(), [clearPendingSave]);

  const value = useMemo<AutoPassWhenNoValidActionContextValue>(
    () => ({ enabled: state.enabled, ready: state.ready, setEnabled }),
    [setEnabled, state.enabled, state.ready],
  );

  return (
    <GundamAutoPassSettingsContext.Provider value={value}>
      {children}
    </GundamAutoPassSettingsContext.Provider>
  );
}

export function useAutoPassWhenNoValidAction(): AutoPassWhenNoValidActionContextValue {
  return useContext(GundamAutoPassSettingsContext);
}
