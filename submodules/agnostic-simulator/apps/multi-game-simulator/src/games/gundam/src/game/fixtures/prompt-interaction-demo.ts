import { createMockCommand, createMockResource } from "@tcg/gundam-engine";
import type { CardEffect, CommandCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

function makeCommand(
  name: string,
  sourceText: string,
  directives: CardEffect["directives"],
): CommandCard {
  const effect: CardEffect = {
    type: "command",
    activation: { timing: ["main"] },
    directives,
    sourceText,
  };
  return createMockCommand({
    name,
    cost: 1,
    level: 1,
    effect: sourceText,
    effects: [effect],
  });
}

/** A valid command whose player may resolve or skip a no-target effect. */
export function loadOptionalPromptDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [
        makeCommand("Optional Draw", "You may draw 1.", [
          { action: { action: "draw", count: 1 }, optional: true },
        ]),
      ],
      resourceArea: [createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: { deck: 30, resourceDeck: 10 },
  });
}

/** A valid command that opens the deck-look resolver and requires a top-card choice. */
export function loadDeckLookPromptDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [
        makeCommand("Survey the Deck", "Look at the top 2 cards. Return 1 to the top.", [
          {
            action: {
              action: "lookAtTopDeck",
              count: 2,
              return: "chooseTop",
              remainingDestination: "trash",
            },
          },
        ]),
      ],
      resourceArea: [createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: { deck: 30, resourceDeck: 10 },
  });
}
