// TODO: Once the set is released, we organize the cards by set and type

import { ifYouHaveAnotherPirate } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/targets";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kakamoraLongrangeSpecialist: LorcanaCharacterCardDefinition = {
  id: "zdx",
  missingTestCase: true,
  name: "Kakamora",
  title: "Long-Range Specialist",
  characteristics: ["storyborn", "pirate"],
  text: "A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "A Little Help",
      text: "When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
      optional: true,
      conditions: [ifYouHaveAnotherPirate],
      effects: [dealDamageEffect(1, chosenCharacterOrLocation)],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  illustrator: "Matthew Robert Davies",
  number: 171,
  set: "006",
  rarity: "common",
};
