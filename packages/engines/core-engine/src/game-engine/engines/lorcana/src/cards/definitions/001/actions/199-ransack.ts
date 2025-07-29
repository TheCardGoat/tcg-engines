import { drawThenDiscardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ransack: LorcanaActionCardDefinition = {
  id: "cfx",
  name: "Ransack",
  characteristics: ["action"],
  text: "Draw 2 cards, then choose and discard 2 cards.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw 2 cards, then choose and discard 2 cards.",
      effects: drawThenDiscardEffect({ draw: 2, discard: 2 }),
    },
  ],
  flavour: "Who has time to read labels?",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Amber Kommavongsa",
  number: 199,
  set: "TFC",
  rarity: "uncommon",
};
