import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterWithTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brawl: LorcanaActionCardDefinition = {
  id: "wsx",
  name: "Brawl",
  characteristics: ["action"],
  text: "Banish chosen character with 2 {S} or less.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen character with 2 {S} or less.",
      targets: [
        chosenCharacterWithTarget({
          attribute: "strength",
          comparison: "lte",
          value: 2,
        }),
      ],
      effects: [banishEffect()],
    },
  ],
  flavour:
    "There are two ways to leave the Snuggly Duckling - the door or the window.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "R. la Barbera / L. Giammichele",
  number: 130,
  set: "URR",
  rarity: "common",
};
