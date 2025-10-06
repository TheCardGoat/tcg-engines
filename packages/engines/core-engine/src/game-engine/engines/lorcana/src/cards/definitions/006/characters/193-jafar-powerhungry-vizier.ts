// TODO: Once the set is released, we organize the cards by set and type

import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarPowerhungryVizier: LorcanaCharacterCardDefinition = {
  id: "psh",
  missingTestCase: true,
  name: "Jafar",
  title: "Power‐Hungry Vizier",
  characteristics: ["dreamborn", "villain", "sorcerer"],
  text: "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "You Will Be Paid When The Time Comes",
      text: "During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
      conditions: [{ type: "during-turn", value: "self" }],
      effects: [dealDamageEffect(1, chosenCharacter)],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Federico Maria Cugliari",
  number: 193,
  set: "006",
  rarity: "super_rare",
};
