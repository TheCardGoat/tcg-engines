import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiIntellectualSchemer: CharacterCard = {
  id: "8zk",
  cardType: "character",
  name: "Yokai",
  version: "Intellectual Schemer",
  fullName: "Yokai - Intellectual Schemer",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "INNOVATE You pay 1 {I} less to play characters using their Shift ability.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 97,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2065122bd47f279ddd80c1814074e29a04edb565",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const yokaiIntellectualSchemer: LorcanitoCharacterCard = {
//   id: "zdo",
//   name: "Yokai",
//   title: "Intellectual Schemer",
//   characteristics: ["storyborn", "villain", "inventor"],
//   text: "INNOVATE You pay 1{I} less to play characters using their Shift ability.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       name: "INNOVATE",
//       text: "You pay 1{I} less to play characters using their Shift ability.",
//       ability: "effects",
//       conditions: [duringYourTurn],
//       effects: [
//         {
//           type: "replacement",
//           replacement: "shift",
//           amount: 1,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//
//   colors: ["emerald", "sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Diogo Saito",
//   number: 97,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618139,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
