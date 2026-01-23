import type { ItemCard } from "@tcg/lorcana-types";

export const lantern: ItemCard = {
  id: "o5u",
  cardType: "item",
  name: "Lantern",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "009",
  text: "BIRTHDAY LIGHTS {E} — You pay 1 {I} less for the next character you play this turn.",
  cost: 2,
  cardNumber: 32,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "571543865d85c8113b9baffbbb8680a892462cbe",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { lantern as ogLantern } from "@lorcanito/lorcana-engine/cards/001/items/033-lantern";
//
// export const lantern: LorcanitoItemCard = {
//   ...ogLantern,
//   id: "aa1",
//   reprints: [ogLantern.id],
//   number: 32,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649979,
//   },
// };
//
