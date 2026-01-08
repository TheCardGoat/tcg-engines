import type { ItemCard } from "@tcg/lorcana-types";

export const roseLantern: ItemCard = {
  id: "lzv",
  cardType: "item",
  name: "Rose Lantern",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "MYSTICAL PETALS {E}, 2 {I} — Move 1 damage counter from chosen character to chosen opposing character.",
  cost: 2,
  cardNumber: 67,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4f471ae492d30e74f2e140335be59db281b294d1",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { roseLantern as ogRoseLantern } from "@lorcanito/lorcana-engine/cards/004/items/065-rose-lantern";
//
// export const roseLantern: LorcanitoItemCard = {
//   ...ogRoseLantern,
//   id: "j0w",
//   reprints: [ogRoseLantern.id],
//   number: 67,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647667,
//   },
// };
//
