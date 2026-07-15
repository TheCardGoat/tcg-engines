import { describe, expect, it } from "vite-plus/test";

import { createEngineAdapter } from "./adapter.ts";
import { DEV_PLAYER_ONE } from "./dev-runtime.ts";
import { loadDeployUnitDemo } from "./fixtures/deploy-unit-demo.ts";

describe("createEngineAdapter packet animations", () => {
  it("keeps visible owner-qualified card moves on their real card id", () => {
    const dev = loadDeployUnitDemo();
    const handCardId =
      dev.runtime.getState().ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`]?.[0];
    expect(handCardId).toBeDefined();

    const adapter = createEngineAdapter({
      runtime: dev.runtime,
      staticResources: dev.staticResources,
      viewerId: dev.p1Id,
    });

    const result = adapter.submit("deployUnit", adapter.seedForCard("deployUnit", handCardId!));
    expect(result.ok, JSON.stringify(result)).toBe(true);

    const deployAnimation = adapter
      .packetAnimations()
      .find((entry) => entry.animation.id.includes(":deploy-unit"));

    expect(deployAnimation?.animation.data.kind).toBe("cardMove");
    if (deployAnimation?.animation.data.kind !== "cardMove") {
      throw new Error("expected deploy animation to be a cardMove");
    }
    expect(deployAnimation.animation.data.cardId).toBe(handCardId);
  });
});
