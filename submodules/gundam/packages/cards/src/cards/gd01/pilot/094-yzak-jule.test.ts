import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, asPlayerId, seedShieldsFromDeck } from "@tcg/gundam-engine";
import { gd01YzakJule094 } from "./094-yzak-jule.ts";

describe("Yzak Jule (GD01-094)", () => {
  it("Burst - Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01YzakJule094] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01YzakJule094.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("onEnemyLinkUnitDestroyed card data - timing and condition are correctly structured", () => {
    const effect = gd01YzakJule094.effects?.[1];
    expect(effect).toBeDefined();
    expect(effect!.type).toBe("triggered");
    expect(effect!.activation.timing).toEqual(["onEnemyLinkUnitDestroyed"]);
    expect(effect!.activation.conditions).toEqual([{ type: "selfIsAttacking" }]);
    expect(effect!.activation.restrictions).toEqual([{ type: "oncePerTurn" }]);
    expect(effect!.directives).toEqual([{ action: { action: "draw", count: 1 } }]);
  });
});
