import type { CharacterCard } from "@tcg/lorcana-types";

export const jimHawkinsStubbornCabinBoy: CharacterCard = {
  id: "tx8",
  cardType: "character",
  name: "Jim Hawkins",
  version: "Stubborn Cabin Boy",
  fullName: "Jim Hawkins - Stubborn Cabin Boy",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 173,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6bd8397ecb06c70e85f625ba6d01900bc5dac7e2",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const jimHawkinsStubbornCabinBoy: LorcanitoCharacterCard = {
//   id: "geq",
//   missingTestCase: true,
//   name: "Jim Hawkins",
//   title: "Stubborn Cabin Boy",
//   characteristics: ["storyborn", "hero"],
//   text: "COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Come Here, Come Here, Come Here!",
//       text: "During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)",
//       conditions: [duringYourTurn],
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 0,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Ursula Dorada",
//   number: 173,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593014,
//   },
//   rarity: "common",
// };
//
