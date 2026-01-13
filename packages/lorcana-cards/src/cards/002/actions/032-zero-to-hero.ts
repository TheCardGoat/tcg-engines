import type { ActionCard } from "@tcg/lorcana-types";

export const zeroToHero: ActionCard = {
  id: "1qz",
  cardType: "action",
  name: "Zero to Hero",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "002",
  text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 32,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e304dbf3757b9b3aee99fb65f9752724aac895c5",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const zeroToHero: LorcanitoActionCard = {
//   id: "uyt",
//
//   name: "Zero To Hero",
//   characteristics: ["action", "song"],
//   text: "_A character with cost 2 or more can {E} to sing this song for free.)_\n\nCount the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       optional: false,
//       effects: [
//         youPayXLessToPlayNextCharThisTurn({
//           dynamic: true,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//         }),
//       ],
//     },
//   ],
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Rob Di Salvo",
//   number: 32,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516387,
//   },
//   rarity: "uncommon",
// };
//
