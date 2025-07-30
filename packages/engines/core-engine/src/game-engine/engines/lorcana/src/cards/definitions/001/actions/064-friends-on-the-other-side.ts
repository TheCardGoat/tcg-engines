import { drawCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const friendsOnTheOtherSide: LorcanaActionCardDefinition = {
  id: "rrg",
  name: "Friends On The Other Side",
  characteristics: ["action", "song"],
  text: "Draw 2 cards.",
  type: "action",
  flavour: "The cards, the cards<br />\rthe cards will tell . . .",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Amber Kommavongsa",
  number: 64,
  set: "TFC",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Draw 2 cards.",
      effects: [drawCardEffect({ targets: [selfPlayerTarget], value: 2 })],
    },
  ],
};
