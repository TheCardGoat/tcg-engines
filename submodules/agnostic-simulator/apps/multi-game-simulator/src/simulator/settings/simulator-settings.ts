export interface SimulatorSettings {
  soundVolume: number;
}

export const DEFAULT_SIMULATOR_SETTINGS: SimulatorSettings = {
  soundVolume: 50,
};

export const SIMULATOR_SOUND_VOLUME_STORAGE_KEY = "matchmaking.player.soundVolume";
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
  };
}

export function readLocalSimulatorSettings(storage: Storage | null | undefined): SimulatorSettings {
  if (!storage) {
    return DEFAULT_SIMULATOR_SETTINGS;
  }

  const stored = storage.getItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY);
  if (stored !== null) {
    const parsed = Number(stored);
    return {
      soundVolume: clampSoundVolume(parsed),
    };
  }

  const legacy = readLegacyCyberpunkSoundVolume(storage);
  if (legacy !== null) {
    storage.setItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY, String(legacy));
    return { soundVolume: legacy };
  }

  return DEFAULT_SIMULATOR_SETTINGS;
}

export function writeLocalSimulatorSettings(
  storage: Storage | null | undefined,
  settings: SimulatorSettings,
): void {
  if (!storage) {
    return;
  }
  storage.setItem(SIMULATOR_SOUND_VOLUME_STORAGE_KEY, String(settings.soundVolume));
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
