// TODO: Once the set is released, we organize the cards by set and type

import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesBabyDemigod: LorcanaCharacterCardDefinition = {
  id: "bsk",
  missingTestCase: true,
  name: "Hercules",
  title: "Baby Demigod",
  characteristics: ["storyborn", "hero", "prince"],
  text: "Ward (Opponents can't choose this character except to challenge.)\nSTRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.",
  type: "character",
  abilities: [
    wardAbility,
    {
      type: "activated",
      costs: [{ type: "ink", amount: 3 }],
      effects: [dealDamageEffect(1, chosenDamagedCharacter)],
    },
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  illustrator: "Kipik",
  number: 86,
  set: "006",
  rarity: "legendary",
};
