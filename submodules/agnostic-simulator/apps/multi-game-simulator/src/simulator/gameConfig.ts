export interface BaseGameUserConfig {
  soundVolume: number;
}

export type GameUserConfig<TGameSpecificConfig extends object = Record<string, never>> =
  BaseGameUserConfig & TGameSpecificConfig;

export const DEFAULT_BASE_GAME_USER_CONFIG: BaseGameUserConfig = {
  soundVolume: 35,
};

export function clampSoundVolume(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_BASE_GAME_USER_CONFIG.soundVolume;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function normalizeBaseGameUserConfig(
  raw: Partial<BaseGameUserConfig> | null | undefined,
): BaseGameUserConfig {
  return {
    soundVolume: clampSoundVolume(raw?.soundVolume),
  };
}
