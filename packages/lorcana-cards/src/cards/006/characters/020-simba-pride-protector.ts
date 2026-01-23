import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaPrideProtector: CharacterCard = {
  id: "1i7",
  cardType: "character",
  name: "Simba",
  version: "Pride Protector",
  fullName: "Simba - Pride Protector",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "006",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)\nUNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 20,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c369e5aa59fe458f7582aac34a9bce42be0eb6e6",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { ifThisCharacterIsExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { readyYourOtherCharacters } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const simbaPrideProtector: LorcanitoCharacterCard = {
//   id: "xe0",
//   missingTestCase: true,
//   name: "Simba",
//   title: "Pride Protector",
//   characteristics: ["floodborn", "hero", "prince"],
//   text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)\nUNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Simba"),
//     atTheEndOfYourTurn({
//       name: "Understand the Balance",
//       text: "At the end of your turn, if this character is exerted, you may ready your other characters.",
//       optional: true,
//       secondaryConditions: [ifThisCharacterIsExerted],
//       effects: [readyYourOtherCharacters],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Kendall Hale",
//   number: 20,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591991,
//   },
//   rarity: "legendary",
// };
//
