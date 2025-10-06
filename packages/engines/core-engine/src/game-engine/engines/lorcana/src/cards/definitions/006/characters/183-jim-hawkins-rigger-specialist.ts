// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jimHawkinsRiggerSpecialist: LorcanaCharacterCardDefinition = {
  id: "wxe",
  missingTestCase: true,
  name: "Jim Hawkins",
  title: "Rigging Specialist",
  characteristics: ["floodborn", "hero"],
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jim Hawkins.)\nBATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.",
  type: "character",
  abilities: [
    shiftAbility(3, "Jim Hawkins"),
    whenYouPlayThis({
      name: "Battle Station",
      text: "When you play this character, you may deal 1 damage to chosen character or location.",
      optional: true,
      effects: [dealDamageEffect(1, chosenCharacterOrLocation)],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Ornella Savarese",
  number: 183,
  set: "006",
  rarity: "uncommon",
};
