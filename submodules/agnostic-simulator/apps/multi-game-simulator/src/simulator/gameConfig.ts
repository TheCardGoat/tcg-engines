export type AnimationPacing = "fast" | "standard" | "cinematic";

export const EFFECT_RESULT_HOLD_MS_BY_PACING: Record<AnimationPacing, number> = {
  fast: 650,
  standard: 1_200,
  cinematic: 2_000,
};

export interface BaseGameUserConfig {
  soundVolume: number;
  animationPacing: AnimationPacing;
}

export type GameUserConfig<TGameSpecificConfig extends object = Record<string, never>> =
  BaseGameUserConfig & TGameSpecificConfig;

export const DEFAULT_BASE_GAME_USER_CONFIG: BaseGameUserConfig = {
  soundVolume: 35,
  animationPacing: "standard",
};

export function clampSoundVolume(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_BASE_GAME_USER_CONFIG.soundVolume;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function parseAnimationPacing(value: unknown): AnimationPacing {
  return value === "fast" || value === "standard" || value === "cinematic"
    ? value
    : DEFAULT_BASE_GAME_USER_CONFIG.animationPacing;
}

export function normalizeBaseGameUserConfig(
  raw: Partial<BaseGameUserConfig> | null | undefined,
): BaseGameUserConfig {
  return {
    soundVolume: clampSoundVolume(raw?.soundVolume),
    animationPacing: parseAnimationPacing(raw?.animationPacing),
  };
}
