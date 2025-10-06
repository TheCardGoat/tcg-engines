import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const paniqueTenseImp: LorcanaCharacterCardDefinition = {
  id: "fin",
  name: "Panic",
  title: "High-Strung Imp",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 3,
  illustrator: "Arianna Rea",
  number: 75,
  set: "007",
  rarity: "common",
  lore: 2,
  text: "Startled Shriek When you play this character, you can move up to 2 damage counters from chosen character to chosen opposing character.",
  abilities: [
    whenYouPlayThisCharacter({
      name: "Startled Shriek",
      text: "When you play this character, you can move up to 2 damage counters from chosen character to chosen opposing character.",
      effects: [
        moveDamageEffect({
          amount: 2,
          from: chosenCharacter,
          to: chosenOpposingCharacter,
          upTo: true,
        }),
      ],
    }),
  ],
};
