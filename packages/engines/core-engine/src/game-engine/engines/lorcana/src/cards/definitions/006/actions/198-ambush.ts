import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  yourCharactersTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ambush: LorcanaActionCardDefinition = {
  id: "s1l",
  name: "Ambush!",
  characteristics: ["action"],
  text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
      effects: [
        {
          type: "exert",
          targets: [yourCharactersTarget],
          followedBy: dealDamageEffect({
            targets: [chosenCharacterTarget],
            value: {
              type: "count",
              attribute: "strength",
              previousEffectTargets: true,
            } as DynamicValue,
          }),
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  illustrator: "Ilaria Sposetti",
  number: 198,
  set: "006",
  rarity: "rare",
};
