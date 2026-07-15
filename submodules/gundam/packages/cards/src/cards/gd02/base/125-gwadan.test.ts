import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02Gwadan125 } from "./125-gwadan.ts";

describe("Gwadan (GD02-125)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Gwadan125], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Gwadan125));

    // Top shield enters hand; hand count unchanged (base out, shield in).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Gwadan into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Gwadan125] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Gwadan125);
    const p2 = engine.asPlayer(PLAYER_TWO);

    engine.fireShieldBurst(shieldId);

    expect(p2.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 lets the player discard the newly added red Shield, then draw 1", () => {
    const redShield = createMockUnit({ color: "red", name: "Newly Added Red Shield" });
    const drawOne = createMockUnit({ name: "Draw One" });
    const keepInDeck = createMockUnit({ name: "Keep In Deck" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02Gwadan125],
        resourceArea: activeResources(6),
        deck: [redShield, drawOne, keepInDeck],
      },
      {},
    );
    const [redShieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!redShieldId) throw new Error("Expected a seeded Shield");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.deployBase(gd02Gwadan125));
    expect(p1.getHand()).toEqual([redShieldId]);
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [redShieldId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [redShieldId] }));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(p1.getCardZone(redShieldId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("【Deploy】 on owner's turn — cannot discard a non-red card to draw", () => {
    const blueCard = createMockUnit({ color: "blue", name: "Blue Card" });
    const engine = GundamTestEngine.create(
      { hand: [gd02Gwadan125, blueCard], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.deployBase(gd02Gwadan125));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("【Deploy】 on owner's turn — declining the discard also skips the draw", () => {
    const redCard = createMockUnit({ color: "red", name: "Declined Red Discard" });
    const engine = GundamTestEngine.create(
      { hand: [gd02Gwadan125, redCard], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const trashBefore = p1.getCardsInZone("trash").length;
    const redCardId = p1.getHand()[1]!;

    expectSuccess(p1.deployBase(gd02Gwadan125));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    // Discard declined → `dependsOnPrevious` draw also skipped.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
    expect(p1.getCardZone(redCardId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
