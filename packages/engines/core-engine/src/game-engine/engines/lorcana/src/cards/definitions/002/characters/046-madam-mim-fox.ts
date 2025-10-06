import {
  madameMimAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimFox: LorcanitoCharacterCardDefinition = {
  id: "rds",

  name: "Madam Mim",
  title: "Fox",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**CHASING THE RABBIT** When you play this character, banish her or return another chosen character of yours to your hand.\n\n**Rush** _(This character can challenge the turn they're played.)_",
  type: "character",
  abilities: [
    rushAbility,
    {
      ...madameMimAbility,
      name: "Chasing the Rabbit",
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 46,
  set: "ROF",
  rarity: "rare",
};
