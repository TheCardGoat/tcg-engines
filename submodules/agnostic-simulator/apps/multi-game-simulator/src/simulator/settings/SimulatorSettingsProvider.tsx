import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiUrl } from "../../runtime/gameRuntimeApi";
import { useSimulatorAuth } from "../providers";
import {
  clampSoundVolume,
  normalizeSimulatorSettings,
  readLocalSimulatorSettings,
  writeLocalSimulatorSettings,
  type SimulatorSettings,
} from "./simulator-settings";

export interface SimulatorSettingsContextValue {
  readonly settings: SimulatorSettings;
  readonly setSoundVolume: (volume: number) => void;
}

interface UserSettingsResponse {
  gameplaySettings?: {
    soundVolume?: number;
  };
}

const FALLBACK_SIMULATOR_SETTINGS_CONTEXT: SimulatorSettingsContextValue = {
  settings: normalizeSimulatorSettings(null),
  setSoundVolume: () => undefined,
};

const SimulatorSettingsContext = createContext<SimulatorSettingsContextValue>(
  FALLBACK_SIMULATOR_SETTINGS_CONTEXT,
);
const SAVE_DEBOUNCE_MS = 500;

export function SimulatorSettingsProvider({
  children,
  initialSettings = null,
}: {
  readonly children: React.ReactNode;
  readonly initialSettings?: SimulatorSettings | null;
}) {
  const auth = useSimulatorAuth();
  const [settings, setSettings] = useState<SimulatorSettings>(() =>
    initialSettings
      ? normalizeSimulatorSettings(initialSettings)
      : typeof window === "undefined"
        ? normalizeSimulatorSettings(null)
        : readLocalSimulatorSettings(window.localStorage),
  );
  const initialSoundVolume = initialSettings?.soundVolume ?? null;
  const hydratedForUserRef = useRef<string | null>(null);
  const hydratingForUserRef = useRef<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userEditVersionRef = useRef(0);
  const skipNextSaveRef = useRef(true);
  const initialSettingsAppliedRef = useRef(false);

  const persistLocal = useCallback((next: SimulatorSettings) => {
    if (typeof window === "undefined") {
      return;
    }
    writeLocalSimulatorSettings(window.localStorage, next);
  }, []);

  const clearPendingSave = useCallback(() => {
    if (!saveTimerRef.current) {
      return;
    }
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
  }, []);

  useEffect(() => {
    if (initialSoundVolume === null || initialSettingsAppliedRef.current) {
      return;
    }
    initialSettingsAppliedRef.current = true;
    const next = normalizeSimulatorSettings({ soundVolume: initialSoundVolume });
    skipNextSaveRef.current = true;
    setSettings((current) => (current.soundVolume === next.soundVolume ? current : next));
    persistLocal(next);
    if (auth.userId) {
      hydratedForUserRef.current = auth.userId;
    }
  }, [auth.userId, initialSoundVolume, persistLocal]);

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.userId) {
      hydratingForUserRef.current = null;
      return;
    }
    if (hydratedForUserRef.current === auth.userId || hydratingForUserRef.current === auth.userId) {
      return;
    }
    hydratingForUserRef.current = auth.userId;
    const hydrationEditVersion = userEditVersionRef.current;
    const controller = new AbortController();
    void fetch(apiUrl("platform", "/users/me/settings"), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          hydratingForUserRef.current = null;
          return null;
        }
        const body = (await response.json()) as UserSettingsResponse;
        hydratedForUserRef.current = auth.userId;
        hydratingForUserRef.current = null;
        return body;
      })
      .then((body) => {
        if (userEditVersionRef.current !== hydrationEditVersion) {
          return;
        }
        const soundVolume = body?.gameplaySettings?.soundVolume;
        if (soundVolume === undefined) {
          return;
        }
        const next = { soundVolume: clampSoundVolume(soundVolume) };
        skipNextSaveRef.current = true;
        setSettings(next);
        persistLocal(next);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          hydratingForUserRef.current = null;
          console.error("[simulator-settings] Failed to hydrate settings:", error);
        }
      });

    return () => {
      controller.abort();
      if (hydratingForUserRef.current === auth.userId) {
        hydratingForUserRef.current = null;
      }
    };
  }, [auth.isAuthenticated, auth.userId, persistLocal]);

  useEffect(() => {
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    persistLocal(settings);
    if (!auth.isAuthenticated) {
      clearPendingSave();
      return;
    }
    clearPendingSave();
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      void fetch(apiUrl("platform", "/users/me/settings"), {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ gameplaySettings: { soundVolume: settings.soundVolume } }),
      }).catch((error: unknown) => {
        console.error("[simulator-settings] Failed to save settings:", error);
      });
    }, SAVE_DEBOUNCE_MS);
  }, [auth.isAuthenticated, clearPendingSave, persistLocal, settings]);

  useEffect(() => () => clearPendingSave(), [clearPendingSave]);

  const setSoundVolume = useCallback((volume: number) => {
    setSettings((current) => {
      const next = { soundVolume: clampSoundVolume(volume, current.soundVolume) };
      if (current.soundVolume === next.soundVolume) {
        return current;
      }
      userEditVersionRef.current += 1;
      return next;
    });
  }, []);

  const value = useMemo<SimulatorSettingsContextValue>(
    () => ({ settings, setSoundVolume }),
    [settings, setSoundVolume],
  );

  return (
    <SimulatorSettingsContext.Provider value={value}>{children}</SimulatorSettingsContext.Provider>
  );
}

export function useSimulatorSettings(): SimulatorSettingsContextValue {
  return useContext(SimulatorSettingsContext);
}

export function SimulatorSettingsBridgeProvider({
  children,
  value,
}: {
  readonly children: React.ReactNode;
  readonly value: SimulatorSettingsContextValue;
}) {
  return (
    <SimulatorSettingsContext.Provider value={value}>{children}</SimulatorSettingsContext.Provider>
  );
}
