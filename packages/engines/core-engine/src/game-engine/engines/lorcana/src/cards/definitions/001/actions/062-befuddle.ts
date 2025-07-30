import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOrItemWithCost2OrLessTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const befuddle: LorcanaActionCardDefinition = {
  id: "teb",
  name: "Befuddle",
  characteristics: ["action"],
  text: "Return a character or item with cost 2 or less to their player's hand.",
  type: "action",
  flavour: "Never be afraid to have your mind boggled now and then.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Kendall Hale",
  number: 62,
  set: "TFC",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Return a character or item with cost 2 or less to their player's hand.",
      targets: [chosenCharacterOrItemWithCost2OrLessTarget],
      effects: [
        returnCardEffect({
          to: "hand",
        }),
      ],
    },
  ],
};
