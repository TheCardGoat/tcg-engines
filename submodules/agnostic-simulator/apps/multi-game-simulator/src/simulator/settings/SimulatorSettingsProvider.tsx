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
  normalizePaymentSelectionMode,
  normalizeSimulatorSettings,
  readLocalSimulatorSettings,
  writeLocalSimulatorSettings,
  type SimulatorSettings,
} from "./simulator-settings";

export interface SimulatorSettingsContextValue {
  readonly settings: SimulatorSettings;
  readonly setSoundVolume: (volume: number) => void;
  readonly setCardInteractionMode: (mode: SimulatorSettings["cardInteractionMode"]) => void;
  readonly setAnimationSpeed: (speed: SimulatorSettings["animationSpeed"]) => void;
  readonly setPaymentSelectionMode: (mode: SimulatorSettings["paymentSelectionMode"]) => void;
}

interface UserSettingsResponse {
  playerSettings?: {
    soundVolume?: number;
    cardInteractionMode?: SimulatorSettings["cardInteractionMode"];
    animationSpeed?: SimulatorSettings["animationSpeed"];
    paymentSelectionMode?: SimulatorSettings["paymentSelectionMode"];
  };
  gameplaySettings?: {
    soundVolume?: number;
    cardInteractionMode?: SimulatorSettings["cardInteractionMode"];
    animationSpeed?: SimulatorSettings["animationSpeed"];
    paymentSelectionMode?: SimulatorSettings["paymentSelectionMode"];
  };
}

const FALLBACK_SIMULATOR_SETTINGS_CONTEXT: SimulatorSettingsContextValue = {
  settings: normalizeSimulatorSettings(null),
  setSoundVolume: () => undefined,
  setCardInteractionMode: () => undefined,
  setAnimationSpeed: () => undefined,
  setPaymentSelectionMode: () => undefined,
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
  const normalizedInitialSettings = initialSettings
    ? normalizeSimulatorSettings(initialSettings)
    : null;
  const initialSoundVolume = normalizedInitialSettings?.soundVolume ?? null;
  const initialCardInteractionMode = normalizedInitialSettings?.cardInteractionMode ?? null;
  const initialAnimationSpeed = normalizedInitialSettings?.animationSpeed ?? null;
  const initialPaymentSelectionMode = normalizedInitialSettings?.paymentSelectionMode ?? null;
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
      paymentSelectionMode: initialPaymentSelectionMode,
    });
    skipNextSaveRef.current = true;
    setSettings((current) =>
      current.soundVolume === next.soundVolume &&
      current.cardInteractionMode === next.cardInteractionMode &&
      current.animationSpeed === next.animationSpeed &&
      current.paymentSelectionMode === next.paymentSelectionMode
        ? current
        : next,
    );
    persistLocal(next);
    if (auth.userId) {
      hydratedForUserRef.current = auth.userId;
    }
  }, [
    auth.userId,
    initialAnimationSpeed,
    initialPaymentSelectionMode,
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
          paymentSelectionMode:
            body.playerSettings?.paymentSelectionMode ??
            body.gameplaySettings?.paymentSelectionMode,
        });
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
            paymentSelectionMode: settings.paymentSelectionMode,
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

  const setPaymentSelectionMode = useCallback((mode: SimulatorSettings["paymentSelectionMode"]) => {
    setSettings((current) => {
      const paymentSelectionMode = normalizePaymentSelectionMode(
        mode,
        current.paymentSelectionMode,
      );
      if (current.paymentSelectionMode === paymentSelectionMode) return current;
      userEditVersionRef.current += 1;
      return { ...current, paymentSelectionMode };
    });
  }, []);

  const value = useMemo<SimulatorSettingsContextValue>(
    () => ({
      settings,
      setSoundVolume,
      setCardInteractionMode,
      setAnimationSpeed,
      setPaymentSelectionMode,
    }),
    [settings, setAnimationSpeed, setCardInteractionMode, setPaymentSelectionMode, setSoundVolume],
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
