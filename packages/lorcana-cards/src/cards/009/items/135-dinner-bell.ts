import type { ItemCard } from "@tcg/lorcana-types";

export const dinnerBell: ItemCard = {
  id: "1es",
  cardType: "item",
  name: "Dinner Bell",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "009",
  text: "YOU KNOW WHAT HAPPENS {E}, 2 {I} — Draw cards equal to the damage on chosen character of yours, then banish them.",
  cost: 4,
  cardNumber: 135,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b7177bb86d3f1a7a6cd295c806ef9d9a5af10448",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { dinnerBell as ogDinnerBell } from "@lorcanito/lorcana-engine/cards/002/items/134-dinner-bell";
//
// export const dinnerBell: LorcanitoItemCard = {
//   ...ogDinnerBell,
//   id: "box",
//   reprints: [ogDinnerBell.id],
//   number: 135,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650070,
//   },
// };
//
