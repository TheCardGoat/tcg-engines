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
    // The secondary clause ("if it is your turn, you may discard…") halts
    // on its inner optional prompt — decline it so the test focuses on
    // the primary addShieldToHand assertion.
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: false } }));

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

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 on owner's turn — opting into discard also draws 1", () => {
    const redCard = createMockUnit({ color: "red", name: "Red Discard" });
    const engine = GundamTestEngine.create(
      { hand: [gd02Gwadan125, redCard], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const trashBefore = p1.getCardsInZone("trash").length;

    // Gwadan halts at its 【Deploy】 optional prompt — answer true so
    // the discard fires, and the `dependsOnPrevious` draw fires too.
    expectSuccess(p1.deployBase(gd02Gwadan125));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));

    // Shield moved into hand (addShieldToHand) + draw 1 + discard 1:
    // deck decreases by exactly 1 (draw), trash gains 1 (discard).
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
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
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
  });

  it("【Deploy】 on owner's turn — declining the discard also skips the draw", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Gwadan125], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.deployBase(gd02Gwadan125));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: false } }));

    // Discard declined → `dependsOnPrevious` draw also skipped.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
  });
});
