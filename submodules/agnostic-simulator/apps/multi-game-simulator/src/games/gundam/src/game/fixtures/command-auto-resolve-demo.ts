import { createMockCommand, createMockResource } from "@tcg/gundam-engine";
import type { CardEffect, CommandCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

function makeAutomaticCommand(): CommandCard {
  const effect: CardEffect = {
    type: "command",
    activation: { timing: ["main"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "Draw 1.",
  };
  return createMockCommand({
    name: "Supply Drop",
    cost: 1,
    level: 1,
    effect: effect.sourceText,
    effects: [effect],
  });
}

/** A no-choice Command for proving hand -> focus -> Scrap auto-resolution. */
export function loadCommandAutoResolveDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [makeAutomaticCommand()],
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
