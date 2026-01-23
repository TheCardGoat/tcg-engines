import type { ItemCard } from "@tcg/lorcana-types";

export const baymaxsHealthcareChip: ItemCard = {
  id: "1di",
  cardType: "item",
  name: "Baymax's Healthcare Chip",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "10,000 MEDICAL PROCEDURES {E} - Choose one:\n* Remove up to 1 damage from chosen character. \n* If you have a Robot character in play, remove up to 3 damage from chosen character.",
  cost: 2,
  cardNumber: 166,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b33bfde84513a383239b388b7a1c80ab8e6d98e2",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { tenThousandMedicalProcedures } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const baymaxsHealthcareChip: LorcanitoItemCard = {
//   id: "ele",
//   missingTestCase: true,
//   name: "Baymax's Healthcare Chip",
//   characteristics: ["item"],
//   text: "10,000 MEDICAL PROCEDURES {E} - Choose one:\n* Remove up to 1 damage from chosen character. \n* If you have a Robot character in play, remove up to 3 damage from chosen character.",
//   type: "item",
//   abilities: [tenThousandMedicalProcedures],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Rudy Hill",
//   number: 166,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587969,
//   },
//   rarity: "uncommon",
// };
//
