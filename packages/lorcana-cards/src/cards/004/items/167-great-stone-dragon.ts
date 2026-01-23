import type { ItemCard } from "@tcg/lorcana-types";

export const greatStoneDragon: ItemCard = {
  id: "19h",
  cardType: "item",
  name: "Great Stone Dragon",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "004",
  text: "ASLEEP This item enters play exerted.\nAWAKEN {E} — Put a character card from your discard into your inkwell facedown and exerted.",
  cost: 3,
  cardNumber: 167,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a483198432a5bd7a7c3564e2fe584d5c13f05727",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
//
// export const greatStoneDragon: LorcanitoItemCard = {
//   id: "jbi",
//   name: "Great Stone Dragon",
//   characteristics: ["item"],
//   text: "**ASLEEP** This item enters play exerted.\n\n\n**AWAKEN** {E}- Put a character card from your discard into your inkwell facedown and exerted.",
//   type: "item",
//   abilities: [
//     {
//       type: "resolution",
//       name: "ASLEEP",
//       text: "This item enters play exerted.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "source",
//                 value: "self",
//               },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       type: "activated",
//       name: "AWAKEN",
//       text: "{E}- Put a character card from your discard into your inkwell facedown and exerted.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "move",
//           exerted: true,
//           to: "inkwell",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "zone",
//                 value: "discard",
//               },
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               {
//                 filter: "owner",
//                 value: "self",
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   illustrator: "Ryan Bittner",
//   number: 167,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549341,
//   },
//   rarity: "uncommon",
// };
//
