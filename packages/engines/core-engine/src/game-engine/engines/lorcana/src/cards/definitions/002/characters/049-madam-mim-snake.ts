import { madameMimAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimSnake: LorcanitoCharacterCardDefinition = {
  id: "fo8",
  name: "Madam Mim",
  title: "Snake",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**JUST YOU WAIT** When you play this character, banish her or return another chosen character of yours to your hand.",
  type: "character",
  abilities: [
    {
      ...madameMimAbility,
      name: "Just You Wait",
      text: "When you play this character, banish her or return another chosen character of yours to your hand.",
    },
  ],
  flavour: "I’ve got you rattled now!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 49,
  set: "ROF",
  rarity: "uncommon",
};
