import { discardCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const youHaveForgottenMe: LorcanaActionCardDefinition = {
  id: "z53",
  name: "You Have Forgotten Me",
  characteristics: ["action"],
  text: "Each opponent chooses and discards 2 cards.",
  type: "action",
  flavour: "You are more than what you have become. \n−Mufasa",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Alice Pisoni",
  number: 31,
  set: "TFC",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      responder: "opponent",
      text: "Each opponent chooses and discards 2 cards.",
      effects: [discardCardEffect({ targets: [selfPlayerTarget], value: 2 })],
    },
  ],
};
