import type { ItemCard } from "@tcg/lorcana-types";

export const obscurosphere: ItemCard = {
  id: "wfc",
  cardType: "item",
  name: "Obscurosphere",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "005",
  text: "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
  cost: 1,
  cardNumber: 99,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "74dd8432c36b5bf31c17f28c835974839a1dce6f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoItemCard,
// } from "@lorcanito/lorcana-engine";
// import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const obscurosphere: LorcanitoItemCard = {
//   id: "z4x",
//   missingTestCase: true,
//   name: "Obscurosphere",
//   characteristics: ["item"],
//   text: "**EXTRACT OF EMERALD** 2 {I}, Banish this item – Your characters gain **Ward** until the start of your next turn. _(Opponents can't choose them except to challenge.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "**EXTRACT OF EMERALD**",
//       text: "2 {I}, Banish this item – Your characters gain **Ward** until the start of your next turn. _(Opponents can't choose them except to challenge.)_",
//       costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "ward",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: yourCharacters,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Stefano Zanchi",
//   number: 99,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561171,
//   },
//   rarity: "common",
// };
//
