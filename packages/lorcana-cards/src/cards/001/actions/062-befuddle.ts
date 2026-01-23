import type { ActionCard } from "@tcg/lorcana-types";

export const befuddle: ActionCard = {
  id: "teb",
  cardType: "action",
  name: "Befuddle",
  version: "undefined",
  fullName: "Befuddle - undefined",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "Return a character or item with cost 2 or less to their player",
  cost: 1,
  cardNumber: 62,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const befuddle: LorcanitoActionCard = {
//   id: "teb",
//   name: "Befuddle",
//   characteristics: ["action"],
//   text: "Return a character or item with cost 2 or less to their player's hand.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Befuddle",
//       text: "Return a character or item with cost 2 or less to their player's hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["character", "item"] },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Never be afraid to have your mind boggled now and then.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   illustrator: "Kendall Hale",
//   number: 62,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503355,
//   },
//   rarity: "uncommon",
// };
//
