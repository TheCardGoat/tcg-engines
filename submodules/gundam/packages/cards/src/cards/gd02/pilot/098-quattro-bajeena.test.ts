/**
 * Quattro Bajeena (GD02-098)
 *
 * 【Burst】Add this card to your hand.
 * 【When Linked】If this is an (AEUG) Unit, draw 1. If you do, discard 1.
 *
 * Exercises the `linkedUnitHasTrait` condition and the generic
 * `dependsOnPrevious` primitive chained on a non-targeted draw.
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
  it("【When Linked】 on (AEUG) Link Unit → draw 1 then discard 1", () => {
    const aeugUnit = createMockUnit({
      level: 4,
      cost: 1,
      traits: ["aeug"],
      linkCondition: "[Quattro Bajeena]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [aeugUnit, gd02QuattroBajeena098],
        resourceArea: activeResources(6),
        deck: 10,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.deployUnit(aeugUnit));
    expectSuccess(p1.assignPilot(gd02QuattroBajeena098, aeugUnit));

    // Draw 1 then discard 1: net hand size unchanged from the play,
    // deck -1, trash +1.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
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
        hand: [nonAeugUnit, gd02QuattroBajeena098],
        resourceArea: activeResources(6),
        deck: 10,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const trashBefore = p1.getCardsInZone("trash").length;

    expectSuccess(p1.deployUnit(nonAeugUnit));
    expectSuccess(p1.assignPilot(gd02QuattroBajeena098, nonAeugUnit));

    // No draw, no discard — condition gate blocked the trigger.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
  });
});
