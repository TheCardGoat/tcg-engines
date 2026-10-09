import { CyberpunkGameSettingsSchema } from "@tcg/game-page-contract/settings";
import { apiUrl } from "../../../runtime/gameRuntimeApi";
import { useSimulatorAuth } from "../../../simulator/providers";
import { SIMULATOR_SOUND_PACK_SEEDED_KEY, useSimulatorSettings } from "../../../simulator/settings";
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
import {
  DEFAULT_CYBERPUNK_VISUAL_SELECTION,
  resolveCyberpunkCardBackId,
  resolveCyberpunkPlaymatId,
  type CyberpunkVisualSelection,
} from "../visualAppearance";

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
  choosePaymentSources: boolean;
}

export type UserConfig = GameUserConfig<CyberpunkSpecificUserConfig>;

const DEFAULTS: UserConfig = {
  ...DEFAULT_BASE_GAME_USER_CONFIG,
  diceDisplayMode: "shape",
  diceImageColor: "yellow",
  dicierStyle: "Round-Heavy",
  fieldCardSize: "standard",
  choosePaymentSources: false,
};

const schema = CyberpunkGameSettingsSchema.shape.simulator.unwrap().strip();

const STORAGE_KEY = "cyberpunk:userConfig";
const VISUAL_STORAGE_KEY = "cyberpunk:visualSelection";

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
      choosePaymentSources: parsed.choosePaymentSources === true,
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

function loadVisualSelection(): CyberpunkVisualSelection {
  if (typeof window === "undefined") return DEFAULT_CYBERPUNK_VISUAL_SELECTION;
  try {
    const raw = window.localStorage.getItem(VISUAL_STORAGE_KEY);
    if (!raw) return DEFAULT_CYBERPUNK_VISUAL_SELECTION;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_CYBERPUNK_VISUAL_SELECTION;
    const value = parsed as Record<string, unknown>;
    return {
      cardBackId: resolveCyberpunkCardBackId(
        typeof value.cardBackId === "string" ? value.cardBackId : null,
      ),
      playmatId: resolveCyberpunkPlaymatId(
        typeof value.playmatId === "string" ? value.playmatId : null,
      ),
    };
  } catch {
    return DEFAULT_CYBERPUNK_VISUAL_SELECTION;
  }
}

interface UserConfigContextValue {
  config: UserConfig;
  setConfig: (patch: Partial<UserConfig>) => void;
  visual: CyberpunkVisualSelection;
  setVisual: (patch: Partial<CyberpunkVisualSelection>) => void;
}

const UserConfigContext = createContext<UserConfigContextValue | null>(null);

// SETTINGS PARITY: keep in sync with the platform web app's GameSettingsFields.svelte.
// Both sides save gameSettings.cyberpunk.simulator; keep defaults and choices aligned.
export function UserConfigProvider({ children }: { children: ReactNode }) {
  const auth = useSimulatorAuth();
  const { setSoundPack } = useSimulatorSettings();
  const editVersion = useRef(0);
  const saveQueue = useRef(Promise.resolve());

  const [config, setConfigState] = useState<UserConfig>(loadConfig);
  const [visual, setVisualState] = useState<CyberpunkVisualSelection>(loadVisualSelection);

  // Cyberpunk ships with the Signal sci-fi pack as its primary sound set.
  // The flag (not the pack value) marks seeding, so a player who later picks
  // "Original" explicitly keeps their choice.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storage = window.localStorage;
    if (storage.getItem(SIMULATOR_SOUND_PACK_SEEDED_KEY) !== null) return;
    storage.setItem(SIMULATOR_SOUND_PACK_SEEDED_KEY, "cyberpunk-signal");
    setSoundPack("signal");
  }, [setSoundPack]);

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
        if (parsed.data.visual) {
          const next: CyberpunkVisualSelection = {
            cardBackId: resolveCyberpunkCardBackId(parsed.data.visual.cardBackId),
            playmatId: resolveCyberpunkPlaymatId(parsed.data.visual.playmatId),
          };
          setVisualState(next);
          try {
            localStorage.setItem(VISUAL_STORAGE_KEY, JSON.stringify(next));
          } catch {
            /* best effort */
          }
        }
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

  const setVisual = useCallback(
    (patch: Partial<CyberpunkVisualSelection>) => {
      if (patch.playmatId && patch.playmatId !== "default" && !auth.isPremium) return;
      editVersion.current += 1;
      const visualPatch = CyberpunkGameSettingsSchema.shape.visual.unwrap().parse(patch);
      if (auth.isAuthenticated && Object.keys(visualPatch).length > 0) {
        saveQueue.current = saveQueue.current
          .then(async () => {
            const response = await fetch(apiUrl("platform", "/users/me/settings"), {
              method: "PUT",
              keepalive: true,
              credentials: "include",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ gameSettings: { cyberpunk: { visual: visualPatch } } }),
            });
            if (!response.ok) throw new Error(`Visual settings save failed (${response.status})`);
          })
          .catch((error: unknown) =>
            console.error("[cyberpunk-settings] Failed to save visuals:", error),
          );
      }
      setVisualState((current) => {
        const next = { ...current, ...patch };
        try {
          window.localStorage.setItem(VISUAL_STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* best effort */
        }
        return next;
      });
    },
    [auth.isAuthenticated, auth.isPremium],
  );

  const value = useMemo<UserConfigContextValue>(
    () => ({ config, setConfig, visual, setVisual }),
    [config, setConfig, visual, setVisual],
  );

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

export function useCyberpunkVisualSelection(): CyberpunkVisualSelection {
  const ctx = useContext(UserConfigContext);
  if (!ctx) throw new Error("useCyberpunkVisualSelection must be used inside UserConfigProvider");
  return ctx.visual;
}

export function useSetCyberpunkVisualSelection(): (
  patch: Partial<CyberpunkVisualSelection>,
) => void {
  const ctx = useContext(UserConfigContext);
  if (!ctx)
    throw new Error("useSetCyberpunkVisualSelection must be used inside UserConfigProvider");
  return ctx.setVisual;
}
