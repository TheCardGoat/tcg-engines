import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  yourExertedCharactersFilter,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lightTheFuse: LorcanaActionCardDefinition = {
  id: "cep",
  name: "Light The Fuse",
  characteristics: ["action"],
  text: "Deal 1 damage to chosen character for each exerted character you have in play.",
  type: "action",
  inkwell: false,
  colors: ["ruby", "steel"],
  cost: 1,
  illustrator: "Kenneth Anderson",
  number: 149,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Deal 1 damage to chosen character for each exerted character you have in play.",
      targets: [chosenCharacterTarget],
      effects: [
        dealDamageEffect({
          targets: [chosenCharacterTarget],
          value: {
            type: "count",
            filter: yourExertedCharactersFilter,
          } as DynamicValue,
        }),
      ],
    },
  ],
};
