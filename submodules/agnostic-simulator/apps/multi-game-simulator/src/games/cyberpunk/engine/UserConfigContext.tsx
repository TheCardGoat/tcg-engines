import { CyberpunkGameSettingsSchema } from "@tcg/game-page-contract/settings";
import { apiUrl } from "../../../runtime/gameRuntimeApi";
import { useSimulatorAuth } from "../../../simulator/providers";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  DEFAULT_BASE_GAME_USER_CONFIG,
  clampSoundVolume,
  normalizeBaseGameUserConfig,
  type GameUserConfig,
} from "../../../simulator/gameConfig";

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

export type FieldCardSize = "compact" | "standard" | "large";

export interface CyberpunkSpecificUserConfig {
  diceDisplayMode: DiceDisplayMode;
  diceImageColor: DiceImageColor;
  dicierStyle: DicierStyle;
  fieldCardSize: FieldCardSize;
}

export type UserConfig = GameUserConfig<CyberpunkSpecificUserConfig>;

const DEFAULTS: UserConfig = {
  ...DEFAULT_BASE_GAME_USER_CONFIG,
  diceDisplayMode: "shape",
  diceImageColor: "yellow",
  dicierStyle: "Round-Heavy",
  fieldCardSize: "standard",
};

const schema = CyberpunkGameSettingsSchema.shape.simulator.unwrap().strip();

const STORAGE_KEY = "cyberpunk:userConfig";

export const DEFAULT_USER_CONFIG: UserConfig = DEFAULTS;

export function parseFieldCardSize(value: unknown): FieldCardSize {
  return value === "compact" || value === "standard" || value === "large"
    ? value
    : DEFAULTS.fieldCardSize;
}

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
      fieldCardSize: parseFieldCardSize(parsed.fieldCardSize),
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

// SETTINGS PARITY: keep in sync with the platform web app's GameSettingsFields.svelte.
// Both sides save gameSettings.cyberpunk.simulator; keep defaults and choices aligned.
export function UserConfigProvider({ children }: { children: ReactNode }) {
  const auth = useSimulatorAuth();
  const editVersion = useRef(0);
  const saveQueue = useRef(Promise.resolve());

  const [config, setConfigState] = useState<UserConfig>(loadConfig);

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    const version = editVersion.current;
    const controller = new AbortController();
    void fetch(apiUrl("platform", "/users/me/settings"), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Settings load failed (${response.status})`);
        const body: unknown = await response.json();
        if (!body || typeof body !== "object" || !("gameSettings" in body)) return;
        const gameSettings = body.gameSettings;
        if (!gameSettings || typeof gameSettings !== "object" || !("cyberpunk" in gameSettings))
          return;
        const parsed = CyberpunkGameSettingsSchema.safeParse(gameSettings.cyberpunk);
        if (!parsed.success || controller.signal.aborted || editVersion.current !== version) return;
        setConfigState((current) => {
          const next = { ...current, ...parsed.data.simulator };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {
            /* best effort */
          }
          return next;
        });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          console.error("[cyberpunk-settings] Failed to load:", error);
      });
    return () => controller.abort();
  }, [auth.isAuthenticated, auth.userId]);

  const setConfig = useCallback(
    (patch: Partial<UserConfig>) => {
      editVersion.current += 1;
      const simulator = schema.parse(patch);
      if (auth.isAuthenticated && Object.keys(simulator).length > 0) {
        saveQueue.current = saveQueue.current
          .then(async () => {
            const response = await fetch(apiUrl("platform", "/users/me/settings"), {
              method: "PUT",
              keepalive: true,
              credentials: "include",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ gameSettings: { cyberpunk: { simulator } } }),
            });
            if (!response.ok) throw new Error(`Settings save failed (${response.status})`);
          })
          .catch((error: unknown) => console.error("[cyberpunk-settings] Failed to save:", error));
      }
      setConfigState((prev) => {
        const next = {
          ...prev,
          ...patch,
          soundVolume:
            patch.soundVolume === undefined
              ? prev.soundVolume
              : clampSoundVolume(patch.soundVolume),
          fieldCardSize:
            patch.fieldCardSize === undefined
              ? prev.fieldCardSize
              : parseFieldCardSize(patch.fieldCardSize),
        };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
        return next;
      });
    },
    [auth.isAuthenticated],
  );

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
