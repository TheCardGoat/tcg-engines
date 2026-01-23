import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinIntrepidCommander: CharacterCard = {
  id: "z1l",
  cardType: "character",
  name: "Aladdin",
  version: "Intrepid Commander",
  fullName: "Aladdin - Intrepid Commander",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aladdin.)\nREMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 119,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7e4d253d23bf3576df52bdc66b20bd353eea56dd",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const aladdinIntrepidCommander: LorcanitoCharacterCard = {
//   id: "zw4",
//   missingTestCase: true,
//   name: "Aladdin",
//   title: "Intrepid Commander",
//   characteristics: ["floodborn", "hero", "prince"],
//   text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aladdin.)\nREMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "aladdin"),
//     {
//       type: "resolution",
//       name: "Remember Your Training",
//       text: "When you play this character, your characters get +2 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: yourCharacters,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Alice Pisoni",
//   number: 119,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588075,
//   },
//   rarity: "uncommon",
// };
//
