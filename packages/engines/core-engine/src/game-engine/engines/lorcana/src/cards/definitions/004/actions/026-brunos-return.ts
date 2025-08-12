import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  removeDamageEffect,
  returnCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterFromDiscardTarget,
  chosenCharacterTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brunosReturn: LorcanaActionCardDefinition = {
  id: "azx",
  name: "Bruno's Return",
  characteristics: ["action"],
  text: "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
      effects: [
        returnCardEffect({
          to: "hand",
          from: "discard",
          targets: [chosenCharacterFromDiscardTarget],
        }),
        removeDamageEffect({
          targets: [chosenCharacterTarget],
          value: upToValue(2),
        }),
      ],
    },
  ],
  colors: ["amber"],
  cost: 2,
  illustrator: "Cristian Romero",
  number: 26,
  set: "URR",
  rarity: "uncommon",
};
