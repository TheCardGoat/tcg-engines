import type { ItemCard } from "@tcg/lorcana-types";

export const mauricesWorkshop: ItemCard = {
  id: "18c",
  cardType: "item",
  name: "Maurice's Workshop",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.",
  cost: 3,
  cardNumber: 168,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9eb2122e42f3807342d6c09800108855dec2073b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mauricesWorkshop: LorcanitoItemCard = {
//   id: "oja",
//
//   name: "Maurice's Workshop",
//   characteristics: ["item"],
//   text: "**LOOKING FOR THIS?** Whenever you play another item, you may pay 1 {I} to draw a card.",
//   type: "item",
//   abilities: [
//     wheneverTargetPlays({
//       name: "Looking For This?",
//       text: "Whenever you play another item, you may pay 1 {I} to draw a card.",
//       optional: true,
//       costs: [{ type: "ink", amount: 1 }],
//       excludeSelf: true,
//       triggerFilter: [
//         { filter: "type", value: "item" },
//         { filter: "owner", value: "self" },
//       ],
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "The solution you need could be just a few adjustments away.",
//   colors: ["sapphire"],
//   cost: 3,
//   illustrator: "Antonia Flechsig",
//   number: 168,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527770,
//   },
//   rarity: "rare",
// };
//
