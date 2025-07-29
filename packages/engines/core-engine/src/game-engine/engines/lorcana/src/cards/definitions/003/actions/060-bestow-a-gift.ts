import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";

export const bestowAGift: LorcanitoActionCard = {
  id: "v46",
  missingTestCase: true,
  name: "Bestow a Gift",
  characteristics: ["action"],
  text: "Move 1 damage counter from chosen character to chosen opposing character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
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
    '"From magic ink I call this gift \nFly my minion, thy wings be swift!" \n- Maleficent',
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Dylan Bonner",
  number: 60,
  set: "ITI",
  rarity: "common",
};
