// TODO: Once the set is released, we organize the cards by set and type

import { moveDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect";
import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jujuMamaOdiesCompanion: LorcanaCharacterCardDefinition = {
  id: "kbm",
  missingTestCase: true,
  name: "Juju",
  title: "Mama Odie's Companion",
  characteristics: ["storyborn", "ally"],
  text: "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
  type: "character",
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
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Jeanne Plounevez",
  number: 41,
  set: "006",
  rarity: "common",
};
