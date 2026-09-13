import type { CardInteractionMode } from "@tcg/simulator-contract";
import type { AnimationSpeed } from "@tcg/simulator-runtime/animation";

export type { AnimationSpeed };

export interface SimulatorSettings {
  soundVolume: number;
  cardInteractionMode: CardInteractionMode;
  animationSpeed: AnimationSpeed;
}

export const DEFAULT_SIMULATOR_SETTINGS: SimulatorSettings = {
  soundVolume: 50,
  cardInteractionMode: "detailed",
  animationSpeed: "normal",
};

export const SIMULATOR_SOUND_VOLUME_STORAGE_KEY = "matchmaking.player.soundVolume";
export const SIMULATOR_CARD_INTERACTION_MODE_STORAGE_KEY = "matchmaking.player.cardInteractionMode";
export const SIMULATOR_ANIMATION_SPEED_STORAGE_KEY = "matchmaking.player.animationSpeed";
export const LEGACY_CYBERPUNK_USER_CONFIG_STORAGE_KEY = "cyberpunk:userConfig";

export function clampSoundVolume(
  value: unknown,
  fallback = DEFAULT_SIMULATOR_SETTINGS.soundVolume,
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function normalizeSimulatorSettings(raw: unknown): SimulatorSettings {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_SIMULATOR_SETTINGS;
  }
  const candidate = raw as Partial<SimulatorSettings>;
  return {
    soundVolume: clampSoundVolume(candidate.soundVolume),
    cardInteractionMode: normalizeCardInteractionMode(candidate.cardInteractionMode),
    animationSpeed: normalizeAnimationSpeed(candidate.animationSpeed),
  };
}

export function normalizeCardInteractionMode(
  value: unknown,
  fallback: CardInteractionMode = DEFAULT_SIMULATOR_SETTINGS.cardInteractionMode,
): CardInteractionMode {
  return value === "quick" || value === "detailed" ? value : fallback;
}

export function normalizeAnimationSpeed(
  value: unknown,
  fallback: AnimationSpeed = DEFAULT_SIMULATOR_SETTINGS.animationSpeed,
): AnimationSpeed {
  return value === "off" || value === "fast" || value === "normal" || value === "slow"
    ? value
    : fallback;
}

export function readLocalSimulatorSettings(storage: Storage | null | undefined): SimulatorSettings {
  if (!storage) {
    return DEFAULT_SIMULATOR_SETTINGS;
  }

  const stored = storage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY);
  const storedCardInteractionMode = storage.getItem(SIMULATOR_CARD_INTERACTION_MODE_STORAGE_KEY);
  const storedAnimationSpeed = storage.getItem(SIMULATOR_ANIMATION_SPEED_STORAGE_KEY);
  const cardInteractionMode = normalizeCardInteractionMode(storedCardInteractionMode);
  const animationSpeed = normalizeAnimationSpeed(storedAnimationSpeed);
  if (stored !== null) {
    const parsed = Number(stored);
    return { soundVolume: clampSoundVolume(parsed), cardInteractionMode, animationSpeed };
  }

  const legacy = readLegacyCyberpunkSoundVolume(storage);
  if (legacy !== null) {
    storage.setItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY, String(legacy));
    return { soundVolume: legacy, cardInteractionMode, animationSpeed };
  }

  return { ...DEFAULT_SIMULATOR_SETTINGS, cardInteractionMode, animationSpeed };
}

export function writeLocalSimulatorSettings(
  storage: Storage | null | undefined,
  settings: SimulatorSettings,
): void {
  if (!storage) {
    return;
  }
  storage.setItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY, String(settings.soundVolume));
  storage.setItem(SIMULATOR_CARD_INTERACTION_MODE_STORAGE_KEY, settings.cardInteractionMode);
  storage.setItem(SIMULATOR_ANIMATION_SPEED_STORAGE_KEY, settings.animationSpeed);
}

function readLegacyCyberpunkSoundVolume(storage: Storage): number | null {
  const raw = storage.getItem(LEGACY_CYBERPUNK_USER_CONFIG_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as { soundVolume?: unknown };
    return typeof parsed.soundVolume === "number" ? clampSoundVolume(parsed.soundVolume) : null;
  } catch {
    return null;
  }
}
