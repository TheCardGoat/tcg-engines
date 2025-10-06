// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rabbitIndignantPirate: LorcanaCharacterCardDefinition = {
  id: "rdz",
  missingTestCase: true,
  name: "Rabbit",
  title: "Indignant Pirate",
  characteristics: ["dreamborn", "ally", "pirate"],
  text: "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Indignant Pirate",
      text: "When you play this character, you may remove up to 1 damage from chosen character.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 1,
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Samoldstoree",
  number: 22,
  set: "006",
  rarity: "common",
};
