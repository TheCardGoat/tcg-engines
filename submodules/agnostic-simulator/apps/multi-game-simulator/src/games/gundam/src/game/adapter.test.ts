import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { createEngineAdapter } from "./adapter.ts";
import { DEV_PLAYER_ONE } from "./dev-runtime.ts";
import { loadDeployUnitDemo } from "./fixtures/deploy-unit-demo.ts";
import { loadMulliganAnimationDemo } from "./fixtures/mulligan-animation-demo.ts";

describe("createEngineAdapter packet animations", () => {
  afterEach(() => vi.unstubAllGlobals());

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
      .find((entry) => entry.animation?.id.includes(":deploy-unit"));

    expect(deployAnimation?.animation?.data.kind).toBe("cardMove");
    if (deployAnimation?.animation?.data.kind !== "cardMove") {
      throw new Error("expected deploy animation to be a cardMove");
    }
    expect(deployAnimation.animation.data.cardId).toBe(handCardId);
  });

  it("submits commands when randomUUID is unavailable in a non-secure browser context", () => {
    vi.stubGlobal("crypto", {});
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
  });

  it("maps a real mulligan redraw to hand-to-deck then deck-to-hand transfers", () => {
    const dev = loadMulliganAnimationDemo();
    const adapter = createEngineAdapter({
      runtime: dev.runtime,
      staticResources: dev.staticResources,
      viewerId: dev.p1Id,
    });
    const unsubscribe = adapter.subscribe(() => {});

    expect(adapter.view().status.phase).toBe("mulligan");
    expect(adapter.view().zones.zones[`hand:${DEV_PLAYER_ONE}`]?.cards).toHaveLength(5);

    const result = adapter.submit("alterHand", { wantsRedraw: true });
    expect(result.ok, JSON.stringify(result)).toBe(true);

    const planEntry = adapter
      .packetAnimations()
      .find((entry) => entry.plan?.id.includes("mulligan-redraw"));
    const transfers = planEntry?.plan?.steps.filter((step) => step.type === "entityTransfer") ?? [];
    const returns = transfers.filter(
      (step) =>
        step.from?.id === `hand:${DEV_PLAYER_ONE}` && step.to?.id === `deck:${DEV_PLAYER_ONE}`,
    );
    const draws = transfers.filter(
      (step) =>
        step.from?.id === `deck:${DEV_PLAYER_ONE}` && step.to?.id === `hand:${DEV_PLAYER_ONE}`,
    );
    const shuffle = planEntry?.plan?.steps.find(
      (step) => step.type === "randomization" && step.kind === "shuffle",
    );

    expect(returns).toHaveLength(5);
    expect(draws).toHaveLength(5);
    expect(shuffle).toMatchObject({
      at: { kind: "zone", id: `deck:${DEV_PLAYER_ONE}`, ownerId: DEV_PLAYER_ONE },
      audioCue: "deck.shuffle",
    });
    expect(
      returns.every((step) => step.sourceFace === "public" && step.destinationFace === "hidden"),
    ).toBe(true);
    expect(
      draws.every((step) => step.sourceFace === "hidden" && step.destinationFace === "public"),
    ).toBe(true);
    expect(Math.min(...draws.map((step) => step.startAtMs ?? 0))).toBe(
      Math.max(...returns.map((step) => (step.startAtMs ?? 0) + (step.durationMs ?? 0))),
    );
    expect(shuffle?.startAtMs).toBe(
      Math.max(...draws.map((step) => (step.startAtMs ?? 0) + (step.durationMs ?? 0))),
    );
    expect(adapter.view().status.phase).toBe("mulligan");
    expect(adapter.view().status.activePlayer).not.toBe(DEV_PLAYER_ONE);
    expect(adapter.view().zones.zones[`hand:${DEV_PLAYER_ONE}`]?.cards).toHaveLength(5);
    unsubscribe();
  });

  it("coalesces synchronous runtime updates into one coherent store notification", async () => {
    const dev = loadDeployUnitDemo();
    const handCardId =
      dev.runtime.getState().ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`]?.[0];
    expect(handCardId).toBeDefined();
    const adapter = createEngineAdapter({
      runtime: dev.runtime,
      staticResources: dev.staticResources,
      viewerId: dev.p1Id,
    });
    const onChange = vi.fn();
    const unsubscribe = adapter.subscribe(onChange);

    const deploy = adapter.submit("deployUnit", adapter.seedForCard("deployUnit", handCardId!));
    expect(deploy.ok, JSON.stringify(deploy)).toBe(true);
    const pass = adapter.submit("passTurn", {});
    expect(pass.ok, JSON.stringify(pass)).toBe(true);
    expect(onChange).not.toHaveBeenCalled();

    await Promise.resolve();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(adapter.packetAnimations().length).toBeGreaterThan(0);
    unsubscribe();
  });
});
