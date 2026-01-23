import type { ItemCard } from "@tcg/lorcana-types";

export const inscrutableMap: ItemCard = {
  id: "fpa",
  cardType: "item",
  name: "Inscrutable Map",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "010",
  text: "BACKTRACK {E}, 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
  cost: 3,
  cardNumber: 99,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3897aac04d62702fc584a4d0ce2ac7466a186d2c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const inscrutableMap: LorcanitoItemCard = {
//   id: "i89",
//   name: "Inscrutable Map",
//   characteristics: ["item"],
//   text: "BACKTRACK {E} , 1 {I} — Chosen opposing character gets -1 {L} until the start of your next turn.",
//   type: "item",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Jessen Cao",
//   number: 99,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658445,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "activated",
//       name: "BACKTRACK",
//       text: "{E} , 1 {I} — Chosen opposing character gets -1 until the start of your next turn.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           duration: "next_turn",
//           until: true,
//           modifier: "subtract",
//           target: chosenOpposingCharacter,
//         },
//       ],
//     },
//   ],
// };
//
