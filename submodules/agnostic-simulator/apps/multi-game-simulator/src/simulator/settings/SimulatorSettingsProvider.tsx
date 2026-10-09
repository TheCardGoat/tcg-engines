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
  normalizeAnimationSpeed,
  normalizeCardInteractionMode,
  normalizeSimulatorSettings,
  normalizeSoundPack,
  readLocalSimulatorSettings,
  writeLocalSimulatorSettings,
  type SimulatorSettings,
  type SimulatorSoundPackId,
} from "./simulator-settings";

export interface SimulatorSettingsContextValue {
  readonly settings: SimulatorSettings;
  readonly setSoundVolume: (volume: number) => void;
  readonly setSoundPack: (pack: SimulatorSoundPackId) => void;
  readonly setCardInteractionMode: (mode: SimulatorSettings["cardInteractionMode"]) => void;
  readonly setAnimationSpeed: (speed: SimulatorSettings["animationSpeed"]) => void;
}

interface UserSettingsResponse {
  playerSettings?: {
    soundVolume?: number;
    cardInteractionMode?: SimulatorSettings["cardInteractionMode"];
    animationSpeed?: SimulatorSettings["animationSpeed"];
  };
  gameplaySettings?: {
    soundVolume?: number;
    cardInteractionMode?: SimulatorSettings["cardInteractionMode"];
    animationSpeed?: SimulatorSettings["animationSpeed"];
  };
}

const FALLBACK_SIMULATOR_SETTINGS_CONTEXT: SimulatorSettingsContextValue = {
  settings: normalizeSimulatorSettings(null),
  setSoundVolume: () => undefined,
  setSoundPack: () => undefined,
  setCardInteractionMode: () => undefined,
  setAnimationSpeed: () => undefined,
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
  // Latest-settings mirror for async hydration, which must not clobber the
  // locally stored sound pack that the server payload does not carry.
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const normalizedInitialSettings = initialSettings
    ? normalizeSimulatorSettings(initialSettings)
    : null;
  const initialSoundVolume = normalizedInitialSettings?.soundVolume ?? null;
  const initialCardInteractionMode = normalizedInitialSettings?.cardInteractionMode ?? null;
  const initialAnimationSpeed = normalizedInitialSettings?.animationSpeed ?? null;
  const hydratedForUserRef = useRef<string | null>(null);
  const hydratingForUserRef = useRef<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<(() => void) | null>(null);
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
    if (!initialSettings || initialSettingsAppliedRef.current) {
      return;
    }
    initialSettingsAppliedRef.current = true;
    const next = normalizeSimulatorSettings({
      soundVolume: initialSoundVolume,
      cardInteractionMode: initialCardInteractionMode,
      animationSpeed: initialAnimationSpeed,
    });
    // The server settings payload carries no sound pack; keep whatever the
    // player chose locally (including a game-seeded default applied in the
    // same commit by a game provider).
    const storedPack =
      typeof window === "undefined"
        ? next.soundPack
        : readLocalSimulatorSettings(window.localStorage).soundPack;
    skipNextSaveRef.current = true;
    setSettings((current) => {
      const merged = { ...next, soundPack: current.soundPack ?? storedPack };
      const unchanged =
        current.soundVolume === merged.soundVolume &&
        current.soundPack === merged.soundPack &&
        current.cardInteractionMode === merged.cardInteractionMode &&
        current.animationSpeed === merged.animationSpeed;
      if (unchanged) {
        return current;
      }
      persistLocal(merged);
      return merged;
    });
    if (auth.userId) {
      hydratedForUserRef.current = auth.userId;
    }
  }, [
    auth.userId,
    initialAnimationSpeed,
    initialCardInteractionMode,
    initialSoundVolume,
    persistLocal,
    initialSettings,
  ]);

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
        if (!body) {
          return;
        }
        const next = normalizeSimulatorSettings({
          soundVolume: body.playerSettings?.soundVolume ?? body.gameplaySettings?.soundVolume,
          cardInteractionMode:
            body.playerSettings?.cardInteractionMode ?? body.gameplaySettings?.cardInteractionMode,
          animationSpeed:
            body.playerSettings?.animationSpeed ?? body.gameplaySettings?.animationSpeed,
        });
        const merged = { ...next, soundPack: settingsRef.current.soundPack };
        skipNextSaveRef.current = true;
        setSettings(merged);
        persistLocal(merged);
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
      pendingSaveRef.current = null;
      clearPendingSave();
      return;
    }
    clearPendingSave();
    const save = () => {
      pendingSaveRef.current = null;
      void fetch(apiUrl("platform", "/users/me/settings"), {
        method: "PUT",
        keepalive: true,
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          playerSettings: {
            soundVolume: settings.soundVolume,
            cardInteractionMode: settings.cardInteractionMode,
            animationSpeed: settings.animationSpeed,
          },
        }),
      }).catch((error: unknown) => {
        console.error("[simulator-settings] Failed to save settings:", error);
      });
    };
    pendingSaveRef.current = save;
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      save();
    }, SAVE_DEBOUNCE_MS);
  }, [auth.isAuthenticated, clearPendingSave, persistLocal, settings]);

  // Matchmaking is a different app: flush before unmount/navigation rather than
  // dropping the final slider/select edit. Logout explicitly clears this pending save.
  useEffect(() => {
    const flush = () => {
      clearPendingSave();
      pendingSaveRef.current?.();
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [clearPendingSave]);

  const setSoundVolume = useCallback((volume: number) => {
    setSettings((current) => {
      const next = {
        ...current,
        soundVolume: clampSoundVolume(volume, current.soundVolume),
      };
      if (current.soundVolume === next.soundVolume) {
        return current;
      }
      userEditVersionRef.current += 1;
      return next;
    });
  }, []);

  const setSoundPack = useCallback((pack: SimulatorSoundPackId) => {
    setSettings((current) => {
      const soundPack = normalizeSoundPack(pack, current.soundPack);
      if (current.soundPack === soundPack) {
        return current;
      }
      userEditVersionRef.current += 1;
      return { ...current, soundPack };
    });
  }, []);

  const setCardInteractionMode = useCallback((mode: SimulatorSettings["cardInteractionMode"]) => {
    setSettings((current) => {
      const cardInteractionMode = normalizeCardInteractionMode(mode, current.cardInteractionMode);
      if (current.cardInteractionMode === cardInteractionMode) {
        return current;
      }
      userEditVersionRef.current += 1;
      return { ...current, cardInteractionMode };
    });
  }, []);

  const setAnimationSpeed = useCallback((speed: SimulatorSettings["animationSpeed"]) => {
    setSettings((current) => {
      const animationSpeed = normalizeAnimationSpeed(speed, current.animationSpeed);
      if (current.animationSpeed === animationSpeed) {
        return current;
      }
      userEditVersionRef.current += 1;
      return { ...current, animationSpeed };
    });
  }, []);

  const value = useMemo<SimulatorSettingsContextValue>(
    () => ({
      settings,
      setSoundVolume,
      setSoundPack,
      setCardInteractionMode,
      setAnimationSpeed,
    }),
    [settings, setAnimationSpeed, setCardInteractionMode, setSoundPack, setSoundVolume],
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
