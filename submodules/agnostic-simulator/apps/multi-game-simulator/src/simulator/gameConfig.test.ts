import { describe, expect, test } from "vite-plus/test";

import { normalizeBaseGameUserConfig } from "./gameConfig.js";

describe("base game user config", () => {
  test("normalizes shared simulator settings", () => {
    expect(
      normalizeBaseGameUserConfig({
        soundVolume: 150,
      }),
    ).toEqual({
      soundVolume: 100,
    });
  });
});
