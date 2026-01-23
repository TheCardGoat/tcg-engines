import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeSteadfastMate: CharacterCard = {
  id: "8zn",
  cardType: "character",
  name: "Mr. Smee",
  version: "Steadfast Mate",
  fullName: "Mr. Smee - Steadfast Mate",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  text: "GOOD CATCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 175,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2066c7b87a1294f2092f7a77cdef7479b815708d",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   duringYourTurnGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const mrSmeeSteadfastMate: LorcanitoCharacterCard = {
//   id: "duj",
//   missingTestCase: true,
//   name: "Mr. Smee",
//   title: "Steadfast Mate",
//   characteristics: ["storyborn", "ally", "pirate"],
//   text: "GOOD CATCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
//   type: "character",
//   abilities: [
//     duringYourTurnGains(
//       "Good Catch",
//       "During your turn, this character gains **Evasive**.",
//       evasiveAbility,
//     ),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Carlos Luzzi",
//   number: 175,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 583849,
//   },
//   rarity: "uncommon",
// };
//
