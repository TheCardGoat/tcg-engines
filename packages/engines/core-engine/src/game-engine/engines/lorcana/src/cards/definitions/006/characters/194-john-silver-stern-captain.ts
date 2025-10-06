// TODO: Once the set is released, we organize the cards by set and type

import {
  resistAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { eachOpposingReadyCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const johnSilverSternCaptain: LorcanaCharacterCardDefinition = {
  id: "fao",
  missingTestCase: true,
  name: "John Silver",
  title: "Stern Captain",
  characteristics: ["floodborn", "villain", "alien", "pirate", "captain"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named John Silver.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nDON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.",
  type: "character",
  abilities: [
    shiftAbility(5, "John Silver"),
    resistAbility(2),
    atTheStartOfYourTurn({
      name: "Don't Just Sit There!",
      text: "At the start of your turn, deal 1 damage to each opposing ready character.",
      effects: [dealDamageEffect(1, eachOpposingReadyCharacter)],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 2,
  illustrator: "Diego Machuca",
  number: 194,
  set: "006",
  rarity: "legendary",
};
