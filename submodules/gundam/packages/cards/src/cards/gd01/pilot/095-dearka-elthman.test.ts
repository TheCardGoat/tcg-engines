import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01DearkaElthman095 } from "./095-dearka-elthman.ts";

describe("Dearka Elthman (GD01-095)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01DearkaElthman095] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01DearkaElthman095.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【When Linked】Discard 1. If you do, draw 1.", () => {
    // dependsOnPrevious: draw fires only if discard resolved.
    // Extra hand card so the discard has a valid target after deploy+assign.
    const linkUnit = createMockUnit({
      level: 3,
      cost: 1,
      linkCondition: "[Dearka Elthman]",
    });
    const fodder = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [linkUnit, gd01DearkaElthman095, fodder],
        resourceArea: activeResources(6),
        deck: 10,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(linkUnit));

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.assignPilot(gd01DearkaElthman095, linkUnit));

    // Discard 1 then draw 1: deck -1 (draw), trash +1 (discard).
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
  });
});
