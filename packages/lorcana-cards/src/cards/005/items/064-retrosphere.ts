import type { ItemCard } from "@tcg/lorcana-types";

export const retrosphere: ItemCard = {
  id: "u85",
  cardType: "item",
  name: "Retrosphere",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  text: "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.",
  cost: 1,
  cardNumber: 64,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6cf03faac3b20c17430e1e021cb4f2745c895067",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
//
// export const retrosphere: LorcanitoItemCard = {
//   id: "i9p",
//   name: "Retrosphere",
//   characteristics: ["item"],
//   text: "**EXTRACT OF AMETHYST** 2 {I}, Banish this item – Return chosen character, item, or location with cost 3 or less to their player’s hand.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "**EXTRACT OF AMETHYST**",
//       text: "2 {I}, Banish this item – Return chosen character, item, or location with cost 3 or less to their player’s hand.",
//       costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 3 },
//               },
//               { filter: "type", value: ["character", "item", "location"] },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   illustrator: "Stefano Zanchi",
//   number: 64,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561475,
//   },
//   rarity: "common",
// };
//
