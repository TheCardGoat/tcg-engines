import type { LocationCard } from "@tcg/lorcana-types";

export const thebesTheBigOlive: LocationCard = {
  id: "niw",
  cardType: "location",
  name: "Thebes",
  version: "The Big Olive",
  fullName: "Thebes - The Big Olive",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "004",
  text: "IF YOU CAN MAKE IT HERE... During your turn, whenever a character banishes another character in a challenge while here, gain 2 lore.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 204,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "54c8fae6bda180eec50905712e19ba3aa890fda2",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const thebesTheBigOlive: LorcanitoLocationCard = {
//   id: "pph",
//   name: "Thebes",
//   title: "The Big Olive",
//   characteristics: ["location"],
//   text: "**IF YOU CAN MAKE IT HERE...** During your turn, whenever a character banishes another character in a challenge while here, you gain 2 lore.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "If You Can Make It Here...",
//       text: "During your turn, whenever a character banishes another character in a challenge while here, you gain 2 lore.",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       ability: wheneverBanishesAnotherCharacterInChallenge({
//         name: "If You Can Make It Here...",
//         text: "During your turn, whenever a character banishes another character in a challenge while here, you gain 2 lore.",
//         effects: [
//           {
//             type: "lore",
//             amount: 2,
//             modifier: "add",
//             target: self,
//           },
//         ],
//       }),
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   moveCost: 1,
//   willpower: 7,
//   illustrator: "Nicolas Ky",
//   number: 204,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549295,
//   },
//   rarity: "common",
// };
//
