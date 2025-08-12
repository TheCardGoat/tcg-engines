import { drawThenDiscardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const strikeAGoodMatch: LorcanaActionCardDefinition = {
  id: "fd2",
  name: "Strike a Good Match",
  characteristics: ["action", "song"],
  text: "Draw 2 cards, then choose and discard a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw 2 cards, then choose and discard a card.",
      effects: drawThenDiscardEffect({ draw: 2, discard: 1 }),
    },
  ],
  flavour: "Please bring honor to us \nPlease bring honor to us all",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Maxine Vee",
  number: 96,
  set: "ITI",
  rarity: "common",
};
