import { describe, expect, test } from "vite-plus/test";

import {
  DEFAULT_BASE_GAME_USER_CONFIG,
  normalizeBaseGameUserConfig,
  parseAnimationPacing,
  type GameUserConfig,
} from "./gameConfig.js";

describe("base game user config", () => {
  test("defaults shared simulator settings", () => {
    expect(DEFAULT_BASE_GAME_USER_CONFIG).toEqual({
      soundVolume: 35,
      animationPacing: "standard",
    });
  });

  test("normalizes shared simulator settings", () => {
    expect(
      normalizeBaseGameUserConfig({
        soundVolume: 150,
        animationPacing: "cinematic",
      }),
    ).toEqual({
      soundVolume: 100,
      animationPacing: "cinematic",
    });
  });

  test("falls back for invalid animation pacing values", () => {
    expect(parseAnimationPacing("instant")).toBe("standard");
  });

  test("allows games to extend the base config shape", () => {
    const config: GameUserConfig<{ customMode: "compact" | "full" }> = {
      ...DEFAULT_BASE_GAME_USER_CONFIG,
      customMode: "compact",
    };

    expect(config.customMode).toBe("compact");
    expect(config.animationPacing).toBe("standard");
  });
});
