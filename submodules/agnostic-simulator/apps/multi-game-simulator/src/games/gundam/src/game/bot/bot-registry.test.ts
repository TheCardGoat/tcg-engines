import { describe, expect, it } from "vite-plus/test";

import { BOT_ATTACHERS } from "./bot-registry.ts";

describe("fixture bot registry", () => {
  it("reattaches every browser fixture that declares an auto-pass opponent", () => {
    const autoPassFixtures = [
      "attack-trigger-buff-demo",
      "attack-trigger-draw-demo",
      "battle-ready-demo",
      "block-step-demo",
      "burst-shield-demo",
      "first-strike-demo",
      "high-maneuver-demo",
      "link-unit-deploy-demo",
      "mutual-destruction-demo",
      "step-interrupt-demo",
      "suppression-demo",
    ];

    for (const fixture of autoPassFixtures) {
      expect(BOT_ATTACHERS[fixture], `${fixture} must survive SSR snapshot reconstruction`).toBe(
        BOT_ATTACHERS["battle-ready-demo"],
      );
    }
  });
});
