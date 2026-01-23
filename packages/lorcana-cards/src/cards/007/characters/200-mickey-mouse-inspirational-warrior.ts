import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseInspirationalWarrior: CharacterCard = {
  id: "vri",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Inspirational Warrior",
  fullName: "Mickey Mouse - Inspirational Warrior",
  inkType: ["steel"],
  set: "007",
  text: "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 200,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "727b46485183fb5777acda6297c425330554ddff",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { duringYourTurnWheneverBanishesCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mickeyMouseInspirationalWarrior: LorcanitoCharacterCard = {
//   id: "khu",
//   name: "Mickey Mouse",
//   title: "Inspirational Warrior",
//   characteristics: ["dreamborn", "hero"],
//   type: "character",
//   inkwell: false,
//   colors: ["steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 200,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619523,
//   },
//   rarity: "legendary",
//   lore: 1,
//   text: "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
//   abilities: [
//     duringYourTurnWheneverBanishesCharacterInChallenge({
//       name: "STIRRING SPIRIT",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
