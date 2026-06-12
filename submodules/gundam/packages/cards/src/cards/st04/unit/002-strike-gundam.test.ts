import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { st04StrikeGundam002 } from "./002-strike-gundam.ts";

describe("Strike Gundam (ST04-002)", () => {
  it("【Deploy】 Draw 1, then discard 1", () => {
    const engine = GundamTestEngine.create({
      hand: [st04StrikeGundam002],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckKey = `deck:${PLAYER_ONE}`;
    const trashKey = `trash:${PLAYER_ONE}`;
    const deckBefore = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;
    const trashBefore = engine.getState().ctx.zones.private.zoneCards[trashKey]?.length ?? 0;

    expectSuccess(p1.deployUnit(st04StrikeGundam002));

    // Deploy triggers draw+1 and discard+1: deck -1, trash +1.
    expect(engine.getState().ctx.zones.private.zoneCards[deckKey]!.length).toBe(deckBefore - 1);
    expect(engine.getState().ctx.zones.private.zoneCards[trashKey]!.length).toBe(trashBefore + 1);
  });
});
