import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const frecklesGoodBoy: LorcanaCharacterCardDefinition = {
  id: "i2s",
  name: "Freckles",
  title: "Good Boy",
  characteristics: ["storyborn", "puppy"],
  text: "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "JUST SO CUTE!",
      text: "When you play this character, chosen opposing character gets -1 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "subtract",
          duration: "turn",
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Laura Pauselli",
  number: 168,
  set: "007",
  rarity: "common",
  lore: 1,
};
