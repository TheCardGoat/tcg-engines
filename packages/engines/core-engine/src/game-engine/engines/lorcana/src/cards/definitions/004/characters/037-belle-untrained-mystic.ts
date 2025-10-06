import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleUntrainedMystic: LorcanaCharacterCardDefinition = {
  id: "gfw",
  reprints: ["k6t"],
  missingTestCase: true,
  name: "Belle",
  title: "Untrained Mystic",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**HERE NOW, DON'T DO THAT** When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Here Now, Don't Do That",
      text: "When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
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
    "No matter what she tried, Belle couldn't \ncompletely heal Beast's wound.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Angelina Ricardo",
  number: 37,
  set: "URR",
  rarity: "common",
};
