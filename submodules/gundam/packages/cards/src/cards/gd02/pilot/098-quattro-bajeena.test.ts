/**
 * Quattro Bajeena (GD02-098)
 *
 * 【Burst】Add this card to your hand.
 * 【When Linked】If this is an (AEUG) Unit, draw 1. If you do, discard 1.
 *
 * Exercises the `linkedUnitHasTrait` condition and player-visible
 * post-draw discard choice.
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02QuattroBajeena098 } from "./098-quattro-bajeena.ts";

describe("Quattro Bajeena (GD02-098)", () => {
  it("【When Linked】 on an (AEUG) Link Unit draws 1, then asks which card to discard", () => {
    const aeugUnit = createMockUnit({
      level: 4,
      cost: 1,
      traits: ["aeug"],
      linkCondition: "[Quattro Bajeena]",
    });
    const discardOption = createMockUnit({ name: "Discard Option" });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
    const engine = GundamTestEngine.create(
      {
        hand: [aeugUnit, gd02QuattroBajeena098, discardOption],
        resourceArea: activeResources(6),
        deck: [remainingDeckCard, drawnCard],
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const discardOptionId = p1.getHand()[2]!;

    expectSuccess(p1.deployUnit(aeugUnit));
    expectSuccess(p1.assignPilot(gd02QuattroBajeena098, aeugUnit));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([discardOptionId]),
      minTargets: 1,
      maxTargets: 1,
    });
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Quattro Bajeena to ask which card to discard after drawing");
    }
    expect(choice.legalTargetIds).toHaveLength(2);
    expectSuccess(p1.resolveEffect({ targets: [discardOptionId] }));

    expect(p1.getCardZone(discardOptionId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });

  it("【When Linked】 on a NON-(AEUG) Link Unit → does nothing", () => {
    // Unit has the correct linkCondition but lacks the (aeug) trait →
    // `linkedUnitHasTrait` condition is false, entire trigger is gated.
    const nonAeugUnit = createMockUnit({
      level: 4,
      cost: 1,
      traits: ["titans"],
      linkCondition: "[Quattro Bajeena]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [nonAeugUnit, gd02QuattroBajeena098, createMockUnit({ name: "Kept Card" })],
        resourceArea: activeResources(6),
        deck: 2,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const keptCardId = p1.getHand()[2]!;

    expectSuccess(p1.deployUnit(nonAeugUnit));
    expectSuccess(p1.assignPilot(gd02QuattroBajeena098, nonAeugUnit));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    expect(p1.getCardZone(keptCardId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
