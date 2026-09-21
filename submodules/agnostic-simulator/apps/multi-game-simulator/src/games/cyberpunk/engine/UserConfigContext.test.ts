import { describe, expect, test } from "vite-plus/test";

import { DEFAULT_USER_CONFIG, parseUserConfig } from "./UserConfigContext.js";

describe("parseUserConfig", () => {
  test("defaults field card size to standard", () => {
    expect(parseUserConfig(null).fieldCardSize).toBe("standard");
    expect(DEFAULT_USER_CONFIG.fieldCardSize).toBe("standard");
  });

  test("preserves valid field card size values", () => {
    expect(parseUserConfig(JSON.stringify({ fieldCardSize: "compact" })).fieldCardSize).toBe(
      "compact",
    );
    expect(parseUserConfig(JSON.stringify({ fieldCardSize: "large" })).fieldCardSize).toBe("large");
  });

  test("rejects invalid field card size values while preserving other settings", () => {
    const config = parseUserConfig(
      JSON.stringify({ fieldCardSize: "huge", diceDisplayMode: "image" }),
    );

    expect(config.fieldCardSize).toBe("standard");
    expect(config.diceDisplayMode).toBe("image");
  });
});
