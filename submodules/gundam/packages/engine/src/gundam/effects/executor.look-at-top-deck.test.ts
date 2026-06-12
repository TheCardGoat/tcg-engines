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
import type { PendingEffect } from "../types.ts";

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

let peIdCounter = 0;
function makePending(effect: CardEffect): PendingEffect {
  return {
    id: `look_top_${++peIdCounter}`,
    sourceCardId: "unused",
    effectIndex: 0,
    kind: "activated",
    controllerId: PLAYER_ONE,
    effect,
  };
}

describe("executor — lookAtTopDeck remainingDestination", () => {
  it("bottom keeps one revealed card on top and moves the rest to bottom", () => {
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const third = createMockUnit({ name: "Third" });
    const fourth = createMockUnit({ name: "Fourth" });
    const engine = GundamTestEngine.create({ deck: [top, second, third, fourth] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [topId, secondId, thirdId] = p1.getCardsInZone("deck");

    engine.getG().pendingEffects.push(makePending(lookAtTopDeckEffect("bottom")));
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          0: { toTop: [topId], toBottom: [secondId, thirdId] },
        },
      }),
    );

    const deckAfter = p1.getCardsInZone("deck");
    expect(deckAfter[0]).toBe(topId);
    expect(deckAfter.slice(-2)).toEqual([secondId, thirdId]);
  });

  it("trash applies even when a tutorFilter is present and no card is tutored", () => {
    const top = createMockUnit({ name: "Top" });
    const second = createMockUnit({ name: "Second" });
    const third = createMockUnit({ name: "Third" });
    const engine = GundamTestEngine.create({ deck: [top, second, third] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [topId, secondId, thirdId] = p1.getCardsInZone("deck");

    engine.getG().pendingEffects.push(makePending(lookAtTopDeckEffect("trash", true)));
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          0: { toTop: [topId], toTrash: [secondId, thirdId] },
        },
      }),
    );

    expect(p1.getCardsInZone("deck")).toEqual([topId]);
    expect(p1.getCardsInZone("trash")).toEqual([secondId, thirdId]);
  });
});
