import type { CharacterCard } from "@tcg/lorcana-types";

export const liloGalacticHero: CharacterCard = {
  id: "1y5",
  cardType: "character",
  name: "Lilo",
  version: "Galactic Hero",
  fullName: "Lilo - Galactic Hero",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "001",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 2,
  cardNumber: 184,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "fc9c030eb04c07f2819aa821557e1f7f0e1f354b",
  },
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const liloGalacticHero: LorcanitoCharacterCard = {
//   id: "x99",
//   name: "Lilo",
//   title: "Galactic Hero",
//   characteristics: ["hero", "dreamborn"],
//   type: "character",
//   flavour: "Space. That's where aliens come from. And also tourists!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 4,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Jared Nickerl",
//   number: 184,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508920,
//   },
//   rarity: "uncommon",
// };
//
