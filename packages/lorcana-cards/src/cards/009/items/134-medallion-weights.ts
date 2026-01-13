import type { ItemCard } from "@tcg/lorcana-types";

export const medallionWeights: ItemCard = {
  id: "1rm",
  cardType: "item",
  name: "Medallion Weights",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "009",
  text: "DISCIPLINE AND STRENGTH {E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
  cost: 2,
  cardNumber: 134,
  inkable: true,
  externalIds: {
    ravensburger: "e357b66e6d92b0712271abd9ecb5a28d7d32212c",
  },
  abilities: [
    {
      id: "1rm-1",
      type: "activated",
      cost: {},
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "DISCIPLINE AND STRENGTH {E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { medallionWeights as ogMedallionWeights } from "@lorcanito/lorcana-engine/cards/004/items/132-medallion-weights";
//
// export const medallionWeights: LorcanitoItemCard = {
//   ...ogMedallionWeights,
//   id: "c57",
//   reprints: [ogMedallionWeights.id],
//   number: 134,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650069,
//   },
// };
//
