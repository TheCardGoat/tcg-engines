import type { ItemCard } from "@tcg/lorcana-types";

export const magicMirror: ItemCard = {
  id: "6c3",
  cardType: "item",
  name: "Magic Mirror",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "009",
  text: "SPEAK! {E}, 4 {I} — Draw a card.",
  cost: 2,
  cardNumber: 65,
  inkable: false,
  externalIds: {
    ravensburger: "16d5c6f33f2646ad892f3449ed12b5f00a046833",
  },
  abilities: [
    {
      id: "6c3-1",
      type: "activated",
      cost: {},
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "SPEAK! {E}, 4 {I} — Draw a card.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { magicMirror as ogMagicMirror } from "@lorcanito/lorcana-engine/cards/001/items/066-magic-mirror";
//
// export const magicMirror: LorcanitoItemCard = {
//   ...ogMagicMirror,
//   id: "z3v",
//   reprints: [ogMagicMirror.id],
//   number: 65,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650008,
//   },
// };
//
