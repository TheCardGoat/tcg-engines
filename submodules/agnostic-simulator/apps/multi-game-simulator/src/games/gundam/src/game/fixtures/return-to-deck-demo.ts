import { createMockCommand, createMockResource, createMockUnit } from "@tcg/gundam-engine";
import type { CardEffect, CommandCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

function makeReturnToDeckCommand(): CommandCard {
  const effect: CardEffect = {
    type: "command",
    activation: { timing: ["main"] },
    directives: [
      {
        action: {
          action: "returnToDeck",
          position: "bottom",
          target: {
            owner: "friendly",
            cardType: "unit",
            zone: "hand",
            count: 1,
          },
        },
      },
    ],
    sourceText: "Return 1 Unit card from your hand to the bottom of your deck.",
  };
  return createMockCommand({
    name: "Strategic Redeployment",
    cost: 1,
    level: 1,
    effect: effect.sourceText,
    effects: [effect],
  });
}

/** Exercises the generic cardsMoved fallback with a visible hand -> deck transfer. */
export function loadReturnToDeckDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [
        makeReturnToDeckCommand(),
        createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, color: "blue", name: "GM" }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 10,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
