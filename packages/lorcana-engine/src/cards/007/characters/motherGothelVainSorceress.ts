import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  wheneverOneOfYourCharChallengesAnotherChar,
  wheneverOneOfYourCharChallengesAnotherCharOrLocation,
} from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";

export const motherGothelVainSorceress: LorcanitoCharacterCard = {
  id: "rm8",
  name: "Mother Gothel",
  title: "Vain Sorceress",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "NOW YOU'VE UPSET ME Whenever one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.",
  type: "character",
  abilities: [
    wheneverOneOfYourCharChallengesAnotherCharOrLocation({
      name: "NOW YOU'VE UPSET ME",
      text: "Whenever one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.",
      optional: true,
      attackerFilter: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
      ],
      effects: [
        moveDamageEffect({
          amount: 1,
          from: chosenCharacter,
          to: chosenOpposingCharacter,
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst", "ruby"],
  cost: 3,
  strength: 1,
  willpower: 4,
  illustrator: "Ian McDonald",
  number: 64,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
