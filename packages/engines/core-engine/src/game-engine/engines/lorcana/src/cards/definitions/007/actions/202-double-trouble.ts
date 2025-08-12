import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  upToTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const doubleTrouble: LorcanaActionCardDefinition = {
  id: "kxb",
  name: "Double Trouble",
  characteristics: ["action"],
  text: "Deal 1 damage to up to 2 chosen characters.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 1 damage to up to 2 chosen characters.",
      effects: [
        dealDamageEffect({
          value: 1,
          targets: upToTarget({
            target: chosenCharacterTarget,
            upTo: 2,
          }),
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Natalie Dombois",
  number: 202,
  set: "007",
  rarity: "uncommon",
};
