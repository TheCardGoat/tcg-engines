// TODO: Once the set is released, we organize the cards by set and type

import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrBigShrewdTycoon: LorcanaCharacterCardDefinition = {
  id: "ic8",
  missingTestCase: true,
  name: "Mr. Big",
  title: "Shrewd Tycoon",
  characteristics: ["storyborn"],
  text: "REPUTATION This character can't be challenged by characters with 2 {S} or more.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Reputation",
      text: "This character can't be challenged by characters with 2 {S} or more.",
      effects: [
        {
          type: "restriction",
          restriction: "be-challenged",
          target: thisCharacter,
          challengerFilters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            {
              filter: "attribute",
              value: "strength",
              comparison: { operator: "gte", value: 2 },
            },
          ],
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 4,
  strength: 1,
  willpower: 1,
  lore: 3,
  illustrator: "Federico Maria Caglioni",
  number: 174,
  set: "006",
  rarity: "rare",
};
