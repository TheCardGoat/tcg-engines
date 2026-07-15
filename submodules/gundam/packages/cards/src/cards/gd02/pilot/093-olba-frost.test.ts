import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, seedShieldsFromDeck } from "@tcg/gundam-engine";
import { gd02OlbaFrost093 } from "./093-olba-frost.ts";

describe("Olba Frost (GD02-093)", () => {
  it("【Burst】Add this card to your hand (constant draw clause untested — requires combat setup)", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02OlbaFrost093] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });
});
