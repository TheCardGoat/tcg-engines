import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, seedShieldsFromDeck } from "@tcg/gundam-engine";
import { gd02FlitAsuno088 } from "./088-flit-asuno.ts";

describe("Flit Asuno (GD02-088)", () => {
  it("【Burst】Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02FlitAsuno088] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });
});
