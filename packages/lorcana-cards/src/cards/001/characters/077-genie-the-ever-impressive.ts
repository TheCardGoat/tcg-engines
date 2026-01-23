import type { CharacterCard } from "@tcg/lorcana-types";

export const genieTheEverImpressive: CharacterCard = {
  id: "175",
  cardType: "character",
  name: "Genie",
  version: "The Ever Impressive",
  fullName: "Genie - The Ever Impressive",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 77,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "9b79f3f2091291724aca48822463ad7cac92b860",
  },
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const genieTheEverImpressive: LorcanitoCharacterCard = {
//   id: "oy4",
//   name: "Genie",
//   title: "The Ever Impressive",
//   characteristics: ["dreamborn", "ally"],
//   type: "character",
//   flavour:
//     "You can wish for nearly anything! Do you want the short version, or should I give you the whole song and dance?",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Matt Chapman",
//   number: 77,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507515,
//   },
//   rarity: "common",
// };
//
