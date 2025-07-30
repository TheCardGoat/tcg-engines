import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterWithTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const worldsGreatestCriminalMind: LorcanaActionCardDefinition = {
  id: "c97",
  name: "World's Greatest Criminal Mind",
  characteristics: ["action", "song"],
  text: "Banish chosen character with 5 {S} or more.",
  type: "action",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  illustrator: "Giulia Riva",
  number: 31,
  set: "ROF",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "Banish chosen character with 5 {S} or more.",
      targets: [
        chosenCharacterWithTarget({
          attribute: "strength",
          comparison: "gte",
          value: 5,
        }),
      ],
      effects: [banishEffect()],
    },
  ],
};
