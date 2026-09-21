import { describe, expect, test } from "vite-plus/test";

import {
  DEFAULT_BASE_GAME_USER_CONFIG,
  normalizeBaseGameUserConfig,
  type GameUserConfig,
} from "./gameConfig.js";

describe("base game user config", () => {
  test("defaults shared simulator settings", () => {
    expect(DEFAULT_BASE_GAME_USER_CONFIG).toEqual({
      soundVolume: 35,
    });
  });

  test("normalizes shared simulator settings", () => {
    expect(
      normalizeBaseGameUserConfig({
        soundVolume: 150,
      }),
    ).toEqual({
      soundVolume: 100,
    });
  });

  test("allows games to extend the base config shape", () => {
    const config: GameUserConfig<{ customMode: "compact" | "full" }> = {
      ...DEFAULT_BASE_GAME_USER_CONFIG,
      customMode: "compact",
    };

    expect(config.customMode).toBe("compact");
    expect(config.soundVolume).toBe(35);
  });
});
