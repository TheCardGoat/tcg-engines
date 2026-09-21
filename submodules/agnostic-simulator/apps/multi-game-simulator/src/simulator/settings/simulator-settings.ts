import type { CardInteractionMode } from "@tcg/simulator-contract";
import type { AnimationSpeed } from "@tcg/simulator-runtime/animation";

export type { AnimationSpeed };

export interface SimulatorSettings {
  soundVolume: number;
  cardInteractionMode: CardInteractionMode;
  animationSpeed: AnimationSpeed;
  paymentSelectionMode: PaymentSelectionMode;
}

/** Shared preference. Games opt in when their engine exposes selectable costs. */
export type PaymentSelectionMode = "automatic" | "choose";

export const DEFAULT_SIMULATOR_SETTINGS: SimulatorSettings = {
  soundVolume: 50,
  cardInteractionMode: "detailed",
  animationSpeed: "normal",
  paymentSelectionMode: "automatic",
};

export const SIMULATOR_SOUND_VOLUME_STORAGE_KEY = "matchmaking.player.soundVolume";
export const SIMULATOR_CARD_INTERACTION_MODE_STORAGE_KEY = "matchmaking.player.cardInteractionMode";
export const SIMULATOR_ANIMATION_SPEED_STORAGE_KEY = "matchmaking.player.animationSpeed";
export const SIMULATOR_PAYMENT_SELECTION_MODE_STORAGE_KEY =
  "matchmaking.player.paymentSelectionMode";
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
    paymentSelectionMode: normalizePaymentSelectionMode(candidate.paymentSelectionMode),
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

export function normalizePaymentSelectionMode(
  value: unknown,
  fallback: PaymentSelectionMode = DEFAULT_SIMULATOR_SETTINGS.paymentSelectionMode,
): PaymentSelectionMode {
  return value === "automatic" || value === "choose" ? value : fallback;
}

export function readLocalSimulatorSettings(storage: Storage | null | undefined): SimulatorSettings {
  if (!storage) {
    return DEFAULT_SIMULATOR_SETTINGS;
  }

  const stored = storage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY);
  const storedCardInteractionMode = storage.getItem(SIMULATOR_CARD_INTERACTION_MODE_STORAGE_KEY);
  const storedAnimationSpeed = storage.getItem(SIMULATOR_ANIMATION_SPEED_STORAGE_KEY);
  const storedPaymentSelectionMode = storage.getItem(SIMULATOR_PAYMENT_SELECTION_MODE_STORAGE_KEY);
  const cardInteractionMode = normalizeCardInteractionMode(storedCardInteractionMode);
  const animationSpeed = normalizeAnimationSpeed(storedAnimationSpeed);
  const paymentSelectionMode = normalizePaymentSelectionMode(storedPaymentSelectionMode);
  if (stored !== null) {
    const parsed = Number(stored);
    return {
      soundVolume: clampSoundVolume(parsed),
      cardInteractionMode,
      animationSpeed,
      paymentSelectionMode,
    };
  }

  const legacy = readLegacyCyberpunkSoundVolume(storage);
  if (legacy !== null) {
    storage.setItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY, String(legacy));
    return { soundVolume: legacy, cardInteractionMode, animationSpeed, paymentSelectionMode };
  }

  return {
    ...DEFAULT_SIMULATOR_SETTINGS,
    cardInteractionMode,
    animationSpeed,
    paymentSelectionMode,
  };
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
  storage.setItem(SIMULATOR_PAYMENT_SELECTION_MODE_STORAGE_KEY, settings.paymentSelectionMode);
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
