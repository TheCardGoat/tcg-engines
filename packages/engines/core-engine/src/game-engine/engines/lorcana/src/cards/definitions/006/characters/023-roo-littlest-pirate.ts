// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rooLittlestPirate: LorcanaCharacterCardDefinition = {
  id: "n3v",
  missingTestCase: true,
  name: "Roo",
  title: "Littlest Pirate",
  characteristics: ["dreamborn", "ally", "pirate"],
  text: "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "I'm a Pirate Too",
      text: "When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
      optional: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Gianluca Barone",
  number: 23,
  set: "006",
  rarity: "common",
};
