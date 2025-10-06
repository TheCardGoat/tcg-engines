// TODO: Once the set is released, we organize the cards by set and type

import {
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrSmeeSteadfastMate: LorcanaCharacterCardDefinition = {
  id: "duj",
  missingTestCase: true,
  name: "Mr. Smee",
  title: "Steadfast Mate",
  characteristics: ["storyborn", "ally", "pirate"],
  text: "GOOD CATCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  type: "character",
  abilities: [
    duringYourTurnGains(
      "Good Catch",
      "During your turn, this character gains **Evasive**.",
      evasiveAbility,
    ),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Carlos Luzzi",
  number: 175,
  set: "006",
  rarity: "uncommon",
};
