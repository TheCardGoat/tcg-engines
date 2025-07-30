import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  yourCharactersInPlayFilter,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const value: DynamicValue = {
  type: "count",
  filter: yourCharactersInPlayFilter,
};

export const strengthOfARagingFire: LorcanaActionCardDefinition = {
  id: "x5y",

  name: "Strength of a Raging Fire",
  characteristics: ["action", "song"],
  text: "Deal damage to chosen character equal to the number of characters you have in play.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal damage to chosen character equal to the number of characters you have in play.",
      targets: [chosenCharacterTarget],
      effects: [
        dealDamageEffect({
          value: value,
        }),
      ],
    },
  ],
  flavour: "Tranquil as a forest \nBut on fire within",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Jared Nickerl / Alex Accorsi",
  number: 201,
  set: "ROF",
  rarity: "rare",
};
