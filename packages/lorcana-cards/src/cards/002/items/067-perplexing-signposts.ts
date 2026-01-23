import type { ItemCard } from "@tcg/lorcana-types";

export const perplexingSignposts: ItemCard = {
  id: "nv1",
  cardType: "item",
  name: "Perplexing Signposts",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.",
  cost: 2,
  cardNumber: 67,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "560069c50fe9ddb3a3f3ce8b2aefc1174c7eb7fc",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacterOfYours: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "owner", value: "self" },
//   ],
// };
//
// export const perplexingSignposts: LorcanitoItemCard = {
//   id: "i4b",
//
//   name: "Perplexing Signposts",
//   characteristics: ["item"],
//   text: "**TO WONDERLAND** Banish this item – Return chosen character of yours to your hand.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "To Wonderland",
//       text: "Banish this item – Return chosen character of yours to your hand.",
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacterOfYours,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Alice: I just wanted to ask you which way I ought to go. \nCheshire Cat: Well, that depends on where you want to get to.",
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Andrew Trabbold",
//   number: 67,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525153,
//   },
//   rarity: "rare",
// };
//
