import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";

import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const roseLantern: LorcanaItemCardDefinition = {
  id: "xin",
  reprints: ["j0w"],
  missingTestCase: true,
  name: "Rose Lantern",
  characteristics: ["item"],
  text: "MYSTICAL PETALS  {E}, 2 {I} − Move 1 damage counter from chosen character to chosen opposing character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Mystical Petals",
      text: "{E}, 2 {I} − Move 1 damage counter from chosen character to chosen opposing character.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        moveDamageEffect({
          amount: 1,
          from: chosenCharacter,
          to: chosenOpposingCharacter,
        }),
      ],
    },
  ],
  flavour:
    "The transformed rose made short work of the Beast's wound. But even the gentlest magic comes at a cost.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Gabriel Angelo",
  number: 65,
  set: "URR",
  rarity: "common",
};
