import type { ItemCard } from "@tcg/lorcana-types";

export const hiddenInkcaster: ItemCard = {
  id: "164",
  cardType: "item",
  name: "Hidden Inkcaster",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "004",
  text: "FRESH INK When you play this item, draw a card.\nUNEXPECTED TREASURE All cards in your hand count as having {IW}.",
  cost: 2,
  cardNumber: 98,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9a55893ec9534cdf491712143ca14b5696e02b1f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayMayDrawACard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const hiddenInkcaster: LorcanitoItemCard = {
//   id: "efb",
//   missingTestCase: true,
//   name: "Hidden Inkcaster",
//   characteristics: ["item"],
//   text: "**FRESH INK** When you play this item, draw a card.\n\n\n**UNEXPECTED TREASURE** All cards in your hand count as having ⏣.",
//   type: "item",
//   abilities: [
//     {
//       ...whenYouPlayMayDrawACard,
//       name: "Fresh Ink",
//     },
//   ],
//   flavour: "It looks like it's been here forever. \n–Flounder",
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Adam Fenton",
//   number: 98,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549437,
//   },
//   rarity: "common",
// };
//
