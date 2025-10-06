// TODO: Once the set is released, we organize the cards by set and type

import {
  chosenCharacter,
  chosenCharacterOfYours,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scarHeartlessHunter: LorcanaCharacterCardDefinition = {
  id: "r0e",
  missingTestCase: true,
  name: "Scar",
  title: "Heartless Hunter",
  characteristics: ["storyborn", "villain"],
  text: "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Bared Teeth",
      text: "When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacterOfYours,
        },
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 5,
  strength: 4,
  willpower: 2,
  lore: 3,
  illustrator: "Cookie",
  number: 127,
  set: "006",
  rarity: "super_rare",
};
