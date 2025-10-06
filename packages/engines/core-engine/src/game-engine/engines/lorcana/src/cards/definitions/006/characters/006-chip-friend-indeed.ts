// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chipFriendIndeed: LorcanaCharacterCardDefinition = {
  id: "dr5",
  name: "Chip",
  title: "Friend Indeed",
  characteristics: ["hero", "storyborn"],
  text: "**DALE'S PARTNER** When you play this character, chosen character gets +1 {L} this turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "DALE'S PARTNER",
      text: "When you play this character, chosen character gets +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Come on, Dale—this is no time for hanging around!",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Ron Baird",
  number: 6,
  set: "006",
  rarity: "common",
};
