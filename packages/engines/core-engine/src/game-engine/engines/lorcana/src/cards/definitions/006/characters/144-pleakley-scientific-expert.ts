// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pleakleyScientificExpert: LorcanaCharacterCardDefinition = {
  id: "izw",
  missingTestCase: true,
  name: "Pleakley",
  title: "Scientific Expert",
  characteristics: ["storyborn", "ally", "alien"],
  text: "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Reporting For Duty",
      text: "When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenCharacterOfYours,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Heidi Neubauer",
  number: 144,
  set: "006",
  rarity: "uncommon",
};
