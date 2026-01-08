import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsLosingHerTemper: CharacterCard = {
  id: "123",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Losing Her Temper",
  fullName: "Queen of Hearts - Losing Her Temper",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "ROYAL PAIN While this character has damage, she gets +3 {S}.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 122,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "88fa1eead948d44f2664e3321bf492777618b145",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileThisCharacterHasDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const queenOfHeartsLosingHerTemper: LorcanitoCharacterCard = {
//   id: "txy",
//   name: "Queen Of Hearts",
//   title: "Losing Her Temper",
//   characteristics: ["storyborn", "villain", "queen"],
//   text: "ROYAL PAIN While this character has damage, she gets +3 {S}.",
//   type: "character",
//   abilities: [
//     whileThisCharacterHasDamageGets({
//       name: "ROYAL PAIN",
//       text: "While this character has damage, she gets +3 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 3,
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 1,
//   willpower: 4,
//   illustrator: "Antoine Couttolenc / Samanta Erdini",
//   number: 122,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619473,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
