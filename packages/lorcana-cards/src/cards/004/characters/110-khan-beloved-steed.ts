import type { CharacterCard } from "@tcg/lorcana-types";

export const khanBelovedSteed: CharacterCard = {
  id: "tux",
  cardType: "character",
  name: "Khan",
  version: "Beloved Steed",
  fullName: "Khan - Beloved Steed",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 110,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "6b9d427c13f4bf6e25d74e6d6073361045e3d3af",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const khanBelovedSteed: LorcanitoCharacterCard = {
//   id: "e8z",
//   name: "Khan",
//   title: "Beloved Steed",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     "As silent as a shadow and faster than the wind: brave Khan, the mightiest stallion.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Nicholas Kole",
//   number: 110,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547780,
//   },
//   rarity: "uncommon",
// };
//
