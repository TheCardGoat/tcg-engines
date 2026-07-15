/**
 * `lookAtTopDeck` EffectAction destination handling.
 *
 * Covers the explicit "return 1 to the top; place the remaining card(s)
 * ..." form separately from legacy tutor effects that return every
 * non-tutored revealed card to the bottom.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import { GundamTestEngine, PLAYER_ONE, createMockUnit, expectSuccess } from "../../index.ts";

function lookAtTopDeckEffect(
  remainingDestination: "bottom" | "trash" | undefined,
  withTutorFilter = false,
): CardEffect {
  return {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [
      {
        action: {
          action: "lookAtTopDeck",
          count: 3,
          return: "chooseTop",
          remainingDestination,
          ...(withTutorFilter
            ? {
                tutorFilter: {
                  owner: "friendly",
                  cardType: "pilot",
                } as const,
              }
            : {}),
        },
      },
    ],
    sourceText: "Look at the top 3 cards of your deck and return 1 to the top.",
  };
}

describe("executor — lookAtTopDeck remainingDestination", () => {
  it("lets the player reorder the actual top cards and reveals the chosen top card next", () => {
    const source = createMockUnit({ effects: [lookAtTopDeckEffect("bottom")] });
    const bottom = createMockUnit({ name: "Bottom sentinel" });
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const third = createMockUnit({ name: "Third" });
    const engine = GundamTestEngine.create(
      { play: [source], deck: [bottom, third, second, top] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(sourceId, 0));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    const [topId, secondId, thirdId] = choice.revealedCardIds;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          0: { toTop: [secondId!], toBottom: [topId!, thirdId!] },
        },
      }),
    );

    expectSuccess(p1.activateAbility(sourceId, 0));
    const nextChoice = p1.getBoardView().pendingChoice;
    if (nextChoice?.kind !== "deckLook") throw new Error("Expected a second deck-look choice");
    expect(nextChoice.revealedCardIds[0]).toBe(secondId);
    expect(nextChoice.revealedCardIds).not.toContain(topId);
  });

  it("trash applies even when a tutorFilter is present and no card is tutored", () => {
    const source = createMockUnit({ effects: [lookAtTopDeckEffect("trash", true)] });
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const third = createMockUnit({ name: "Third" });
    const engine = GundamTestEngine.create({ play: [source], deck: [third, second, top] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(sourceId, 0));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    const [topId, secondId, thirdId] = choice.revealedCardIds;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          0: { toTop: [topId!], toTrash: [secondId!, thirdId!] },
        },
      }),
    );

    expect(p1.getCardsInZone("deck")).toHaveLength(1);
    expect(p1.getCardsInZone("trash")).toEqual(expect.arrayContaining([secondId, thirdId]));
  });
});
