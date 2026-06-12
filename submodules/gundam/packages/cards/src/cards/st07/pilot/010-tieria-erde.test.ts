import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st07TieriaErde010 } from "./010-tieria-erde.ts";

describe("Tieria Erde (ST07-010)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [st07TieriaErde010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Destroyed】draws 1 when the paired CB Unit is destroyed on your opponent's turn", () => {
    const cbLinkUnit = createMockUnit({
      traits: ["cb"],
      linkCondition: "[Tieria Erde]",
      hp: 5,
    });
    const engine = GundamTestEngine.create(
      {
        hand: [st07TieriaErde010],
        play: [cbLinkUnit],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.assignPilot(st07TieriaErde010, unitId));
    engine.endTurn();
    engine.destroyUnit(unitId);

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });

  it("does not draw when the paired CB Unit is destroyed on your turn", () => {
    const cbLinkUnit = createMockUnit({
      traits: ["cb"],
      linkCondition: "[Tieria Erde]",
      hp: 5,
    });
    const engine = GundamTestEngine.create(
      {
        hand: [st07TieriaErde010],
        play: [cbLinkUnit],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.assignPilot(st07TieriaErde010, unitId));
    engine.destroyUnit(unitId);

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
  });
});
