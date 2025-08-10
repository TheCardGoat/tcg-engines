import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  yourCharactersInPlayFilter,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rescueRangersAway: LorcanaActionCardDefinition = {
  id: "fhc",
  name: "Rescue Rangers Away!",
  characteristics: ["action"],
  text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
      targets: [chosenCharacterTarget],
      effects: [
        getEffect({
          targets: [chosenCharacterTarget],
          attribute: "strength",
          value: {
            type: "count",
            filter: yourCharactersInPlayFilter,
            multiplier: -1,
          } as DynamicValue,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Mariana Moreno",
  number: 29,
  set: "006",
  rarity: "uncommon",
};
