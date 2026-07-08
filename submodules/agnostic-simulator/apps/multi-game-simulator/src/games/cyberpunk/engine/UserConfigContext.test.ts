import { describe, expect, test } from "vite-plus/test";

import { DEFAULT_USER_CONFIG, parseUserConfig } from "./UserConfigContext.js";

describe("parseUserConfig", () => {
  test("defaults animation pacing to standard", () => {
    expect(parseUserConfig(null).animationPacing).toBe("standard");
    expect(DEFAULT_USER_CONFIG.animationPacing).toBe("standard");
  });

  test("preserves valid animation pacing values", () => {
    expect(parseUserConfig(JSON.stringify({ animationPacing: "fast" })).animationPacing).toBe(
      "fast",
    );
    expect(parseUserConfig(JSON.stringify({ animationPacing: "cinematic" })).animationPacing).toBe(
      "cinematic",
    );
  });

  test("rejects invalid animation pacing values while preserving other settings", () => {
    const config = parseUserConfig(
      JSON.stringify({ animationPacing: "instant", soundVolume: 150 }),
    );

    expect(config.animationPacing).toBe("standard");
    expect(config.soundVolume).toBe(100);
  });
});
