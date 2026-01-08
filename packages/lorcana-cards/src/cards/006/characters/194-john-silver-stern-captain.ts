import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverSternCaptain: CharacterCard = {
  id: "19b",
  cardType: "character",
  name: "John Silver",
  version: "Stern Captain",
  fullName: "John Silver - Stern Captain",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named John Silver.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nDON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 194,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a35533a3e2773a11318e05fb7d0179e1f4f32b3d",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Alien", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   resistAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { eachOpposingReadyCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const johnSilverSternCaptain: LorcanitoCharacterCard = {
//   id: "fao",
//   missingTestCase: true,
//   name: "John Silver",
//   title: "Stern Captain",
//   characteristics: ["floodborn", "villain", "alien", "pirate", "captain"],
//   text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named John Silver.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nDON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "John Silver"),
//     resistAbility(2),
//     atTheStartOfYourTurn({
//       name: "Don't Just Sit There!",
//       text: "At the start of your turn, deal 1 damage to each opposing ready character.",
//       effects: [dealDamageEffect(1, eachOpposingReadyCharacter)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 8,
//   strength: 6,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Diego Machuca",
//   number: 194,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588130,
//   },
//   rarity: "legendary",
// };
//
