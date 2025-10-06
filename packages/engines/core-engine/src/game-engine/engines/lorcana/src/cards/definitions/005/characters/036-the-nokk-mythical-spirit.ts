import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/target";
import { moveDamageAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theNokkMythicalSpirit: LorcanitoCharacterCardDefinition = {
  id: "abr",
  missingTestCase: true,
  name: "The Nokk",
  title: "Mythical Spirit",
  characteristics: ["storyborn", "ally"],
  text: "**TURNING TIDES** When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
  type: "character",
  abilities: [
    {
      name: "TURNING TIDES",
      text: "When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
      optional: true,
      ...moveDamageAbility({
        amount: 2,
        from: chosenCharacter,
        to: chosenOpposingCharacter,
      }),
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  illustrator: "Randy Bishop",
  number: 36,
  set: "SSK",
  rarity: "common",
};
