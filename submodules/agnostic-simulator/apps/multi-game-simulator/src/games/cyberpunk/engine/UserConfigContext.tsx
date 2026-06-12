import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type DiceDisplayMode = "shape" | "image" | "font";

export type DiceImageColor = "yellow" | "blue" | "red" | "white" | "purple" | "green" | "black";

export type DicierStyle =
  | "Block-Dark"
  | "Block-Heavy"
  | "Block-Light"
  | "Flat-Dark"
  | "Flat-Heavy"
  | "Flat-Light"
  | "Pixel"
  | "Round-Dark"
  | "Round-Heavy"
  | "Round-Light";

export interface UserConfig {
  diceDisplayMode: DiceDisplayMode;
  diceImageColor: DiceImageColor;
  dicierStyle: DicierStyle;
  soundVolume: number;
}

const DEFAULTS: UserConfig = {
  diceDisplayMode: "shape",
  diceImageColor: "yellow",
  dicierStyle: "Round-Heavy",
  soundVolume: 35,
};

const STORAGE_KEY = "cyberpunk:userConfig";

export const DEFAULT_USER_CONFIG: UserConfig = DEFAULTS;

function clampSoundVolume(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULTS.soundVolume;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function parseUserConfig(raw: string | null): UserConfig {
  if (!raw) {
    return DEFAULTS;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<UserConfig>;
    return {
      ...DEFAULTS,
      ...parsed,
      soundVolume: clampSoundVolume(parsed.soundVolume),
    };
  } catch {
    return DEFAULTS;
  }
}

function loadConfig(): UserConfig {
  if (typeof window === "undefined") {
    return DEFAULTS;
  }
  return parseUserConfig(window.localStorage.getItem(STORAGE_KEY));
}

interface UserConfigContextValue {
  config: UserConfig;
  setConfig: (patch: Partial<UserConfig>) => void;
}

const UserConfigContext = createContext<UserConfigContextValue | null>(null);

export function UserConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<UserConfig>(loadConfig);

  const setConfig = useCallback((patch: Partial<UserConfig>) => {
    setConfigState((prev) => {
      const next = {
        ...prev,
        ...patch,
        soundVolume:
          patch.soundVolume === undefined ? prev.soundVolume : clampSoundVolume(patch.soundVolume),
      };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const value = useMemo<UserConfigContextValue>(() => ({ config, setConfig }), [config, setConfig]);

  return <UserConfigContext.Provider value={value}>{children}</UserConfigContext.Provider>;
}

export function useUserConfig(): UserConfig {
  const ctx = useContext(UserConfigContext);
  if (!ctx) {
    throw new Error("useUserConfig must be used inside UserConfigProvider");
  }
  return ctx.config;
}

export function useSetUserConfig(): (patch: Partial<UserConfig>) => void {
  const ctx = useContext(UserConfigContext);
  if (!ctx) {
    throw new Error("useSetUserConfig must be used inside UserConfigProvider");
  }
  return ctx.setConfig;
}
