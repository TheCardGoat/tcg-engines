import type { ItemCard } from "@tcg/lorcana-types";

export const swordInTheStone: ItemCard = {
  id: "pw4",
  cardType: "item",
  name: "Sword in the Stone",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
  cost: 1,
  cardNumber: 136,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5d516a030cbb00532537cf0ee3c543c4989de0e6",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// export const swordInTheStone: LorcanitoItemCard = {
//   id: "cml",
//
//   name: "Sword In The Stone",
//   characteristics: ["item"],
//   text: "{E}, 2 {I} - Chosen character gets +1 {S} this turn for each 1 damage on them.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Sword In The Stone",
//       text: "{E}, 2 {I} - Chosen character gets +1 {S} this turn for each 1 damage on them.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//           amount: {
//             dynamic: true,
//             target: { attribute: "damage" },
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Whoso pulleth out this sword of this stone and anvil is rightwise king born of England.",
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Gaku Kumatori",
//   number: 136,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525105,
//   },
//   rarity: "uncommon",
// };
//
