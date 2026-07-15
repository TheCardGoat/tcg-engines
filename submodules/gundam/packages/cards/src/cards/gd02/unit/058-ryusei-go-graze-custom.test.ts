/**
 * Ryusei-Go (Graze Custom Ⅱ) (GD02-058)
 *
 * 【Deploy】Choose 1 of your Units. Deal 1 damage to it. If you do,
 * draw 1. Then, discard 1.
 *
 * Exercises the generic `dependsOnPrevious` primitive on a **mandatory
 * targeted** predecessor — the damage directive is not optional, but
 * the gate still applies when no friendly Unit is available to damage.
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02RyuseiGoGrazeCustom058 } from "./058-ryusei-go-graze-custom.ts";

describe("Ryusei-Go (Graze Custom Ⅱ) (GD02-058)", () => {
  it("damages the chosen friendly Unit, draws 1, then asks which card to discard", () => {
    const friendly = createMockUnit({ ap: 1, hp: 3, level: 1 });
    const discardOption = createMockUnit({ name: "Discard Option" });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02RyuseiGoGrazeCustom058, discardOption],
        play: [friendly],
        deck: [remainingDeckCard, drawnCard],
        resourceArea: activeResources(3),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const discardOptionId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd02RyuseiGoGrazeCustom058));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([friendlyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [friendlyId] }));

    const discardChoice = p1.getBoardView().pendingChoice;
    expect(discardChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([discardOptionId]),
      minTargets: 1,
      maxTargets: 1,
    });
    if (discardChoice?.kind !== "targetSelection") {
      throw new Error("Expected Ryusei-Go to ask which card to discard after drawing");
    }
    expect(discardChoice.legalTargetIds).toHaveLength(2);
    expectSuccess(p1.resolveEffect({ targets: [discardOptionId] }));

    expect(p1.getDamage(friendlyId)).toBe(1);
    expect(p1.getCardZone(discardOptionId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });

  it("offers the newly deployed Unit when no other friendly Unit is available", () => {
    const discardCard = createMockUnit({ name: "Discard Option" });
    const engine = GundamTestEngine.create({
      hand: [gd02RyuseiGoGrazeCustom058, discardCard],
      deck: 2,
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getHand()[0]!;
    const discardCardId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(sourceId));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Ryusei-Go to ask which friendly Unit to damage");
    }
    expect(choice.legalTargetIds).toEqual([unitId]);
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));
    const discardChoice = p1.getBoardView().pendingChoice;
    expect(discardChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([discardCardId]),
      minTargets: 1,
      maxTargets: 1,
    });
    if (discardChoice?.kind !== "targetSelection") {
      throw new Error("Expected Ryusei-Go to ask which card to discard after drawing");
    }
    expectSuccess(p1.resolveEffect({ targets: [discardCardId] }));

    expect(p1.getDamage(unitId)).toBe(1);
    expect(p1.getCardZone(discardCardId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });
});
