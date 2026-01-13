import type { ItemCard } from "@tcg/lorcana-types";

export const tritonsTrident: ItemCard = {
  id: "l9u",
  cardType: "item",
  name: "Triton's Trident",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "SYMBOL OF POWER Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4cac163f4d3f43aef8387cb36619d3521d9b290d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { forEachCardInYourHand } from "@lorcanito/lorcana-engine/abilities/amounts";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const tritonsTrident: LorcanitoItemCard = {
//   id: "tom",
//   missingTestCase: true,
//   name: "Triton's Trident",
//   characteristics: ["item"],
//   text: "**SYMBOL OF POWER** Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Symbol Of Power",
//       text: "Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//           amount: forEachCardInYourHand,
//         },
//       ],
//     },
//   ],
//   flavour: '"Just imagine all this power in the wrong hands..." — Ursula',
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Matt Chapman",
//   number: 66,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543911,
//   },
//   rarity: "uncommon",
// };
//
