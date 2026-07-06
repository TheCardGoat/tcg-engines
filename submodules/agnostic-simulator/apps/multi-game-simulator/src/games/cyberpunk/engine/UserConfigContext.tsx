import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_BASE_GAME_USER_CONFIG,
  clampSoundVolume,
  normalizeBaseGameUserConfig,
  parseAnimationPacing,
  type GameUserConfig,
} from "../../../simulator/gameConfig";

export type { AnimationPacing } from "../../../simulator/gameConfig";

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

export interface CyberpunkSpecificUserConfig {
  diceDisplayMode: DiceDisplayMode;
  diceImageColor: DiceImageColor;
  dicierStyle: DicierStyle;
}

export type UserConfig = GameUserConfig<CyberpunkSpecificUserConfig>;

const DEFAULTS: UserConfig = {
  ...DEFAULT_BASE_GAME_USER_CONFIG,
  diceDisplayMode: "shape",
  diceImageColor: "yellow",
  dicierStyle: "Round-Heavy",
};

const STORAGE_KEY = "cyberpunk:userConfig";

export const DEFAULT_USER_CONFIG: UserConfig = DEFAULTS;

export function parseUserConfig(raw: string | null): UserConfig {
  if (!raw) {
    return DEFAULTS;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<UserConfig>;
    const baseConfig = normalizeBaseGameUserConfig(parsed);
    return {
      ...DEFAULTS,
      ...parsed,
      ...baseConfig,
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
        animationPacing:
          patch.animationPacing === undefined
            ? prev.animationPacing
            : parseAnimationPacing(patch.animationPacing),
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
