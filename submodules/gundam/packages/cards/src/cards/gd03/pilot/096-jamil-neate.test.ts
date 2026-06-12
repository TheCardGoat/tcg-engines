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
import { gd03JamilNeate096 } from "./096-jamil-neate.ts";

describe("Jamil Neate (GD03-096)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03JamilNeate096] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【During Link】【Attack】 may discard 1; if you do, draw 1", () => {
    const host = createMockUnit({
      level: 4,
      cost: 1,
      ap: 3,
      hp: 5,
      linkCondition: "[Jamil Neate]",
    });
    const discardFodder = createMockUnit({ level: 1, cost: 1 });
    const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd03JamilNeate096, discardFodder],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03JamilNeate096, host));
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().turnMetadata.deployedThisTurn = [];

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
  });

  it("skips the draw when the optional discard is declined", () => {
    const host = createMockUnit({
      level: 4,
      cost: 1,
      ap: 3,
      hp: 5,
      linkCondition: "[Jamil Neate]",
    });
    const discardFodder = createMockUnit({ level: 1, cost: 1 });
    const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd03JamilNeate096, discardFodder],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03JamilNeate096, host));
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().turnMetadata.deployedThisTurn = [];

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const handBefore = p1.getHand().length;
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expect(p1.getHand().length).toBe(handBefore);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
  });
});
