// TODO: Once the set is released, we organize the cards by set and type

import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { ifThisCharacterIsExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { readyYourOtherCharacters } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaPrideProtector: LorcanitoCharacterCardDefinition = {
  id: "xe0",
  missingTestCase: true,
  name: "Simba",
  title: "Pride Protector",
  characteristics: ["floodborn", "hero", "prince"],
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)\nUNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
  type: "character",
  abilities: [
    shiftAbility(3, "Simba"),
    atTheEndOfYourTurn({
      name: "Understand the Balance",
      text: "At the end of your turn, if this character is exerted, you may ready your other characters.",
      optional: true,
      secondaryConditions: [ifThisCharacterIsExerted],
      effects: [readyYourOtherCharacters],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Kendall Hale",
  number: 20,
  set: "006",
  rarity: "legendary",
};
