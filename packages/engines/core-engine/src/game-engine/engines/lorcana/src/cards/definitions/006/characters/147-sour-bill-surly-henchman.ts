// TODO: Once the set is released, we organize the cards by set and type

import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sourBillSurlyHenchman: LorcanaCharacterCardDefinition = {
  id: "n2y",
  missingTestCase: true,
  name: "Sour Bill",
  title: "Surly Henchman",
  characteristics: ["storyborn", "ally"],
  text: "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Unpalatable",
      text: "When you play this character, chosen opposing character gets -2 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          duration: "turn",
          target: chosenOpposingCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Mike Mu / Livio Cacciatore",
  number: 147,
  set: "006",
  rarity: "common",
};
