import type { ItemCard } from "@tcg/lorcana-types";

export const heartOfTeFiti: ItemCard = {
  id: "1vi",
  cardType: "item",
  name: "Heart of Te Fiti",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "009",
  text: "CREATE LIFE {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  cardNumber: 168,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f2d37b460b9e74070319ab78f31a81246eb7f444",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { heartOfTeFiti as heartOfTeFitiAsOrig } from "@lorcanito/lorcana-engine/cards/003/items/164-heart-of-te-fiti";
//
// export const heartOfTeFiti: LorcanitoItemCard = {
//   ...heartOfTeFitiAsOrig,
//   id: "cl8",
//   reprints: [heartOfTeFitiAsOrig.id],
//   number: 168,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650102,
//   },
// };
//
