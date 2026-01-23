import type { ItemCard } from "@tcg/lorcana-types";

export const weightSet: ItemCard = {
  id: "1vv",
  cardType: "item",
  name: "Weight Set",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "002",
  text: "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.",
  cost: 3,
  cardNumber: 204,
  inkable: true,
  externalIds: {
    ravensburger: "f4a817b51d3a5cca4d03b98d0eddc55294471120",
  },
  abilities: [
    {
      id: "1vv-1",
      text: "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.",
      name: "TRAINING",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const weightSet: LorcanitoItemCard = {
//   id: "k1c",
//
//   name: "Weight Set",
//   characteristics: ["item"],
//   text: "**TRAINING** Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
//   type: "item",
//   abilities: [
//     wheneverTargetPlays({
//       name: "Training",
//       text: "Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
//       optional: true,
//       costs: [{ type: "ink", amount: 1 }],
//       triggerFilter: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//         {
//           filter: "attribute",
//           value: "strength",
//           comparison: { operator: "gte", value: 4 },
//         },
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
//   flavour: "Go the distance with the right equipment.",
//   colors: ["steel"],
//   cost: 3,
//   inkwell: true,
//   illustrator: "Brian Weisz",
//   number: 204,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527529,
//   },
//   rarity: "rare",
// };
//
