import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const snowWhiteLostInTheForest: LorcanitoCharacterCardDefinition = {
  id: "h4k",
  name: "Snow White",
  title: "Lost in the Forest",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**I WON'T HURT YOU** When you play this character, you may remove up to 2 damage from chosen character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "I WON'T HURT YOU",
      text: "When you play this character, you may remove up to 2 damage from chosen character.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Why, you're all alone, just like me.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "LadyShalirin",
  number: 23,
  set: "ROF",
  rarity: "common",
};
