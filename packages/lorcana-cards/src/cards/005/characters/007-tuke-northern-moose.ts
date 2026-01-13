import type { CharacterCard } from "@tcg/lorcana-types";

export const tukeNorthernMoose: CharacterCard = {
  id: "1i0",
  cardType: "character",
  name: "Tuke",
  version: "Northern Moose",
  fullName: "Tuke - Northern Moose",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "005",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 7,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "c2b3afd5dcc637d2a94889dcab2f2ca97c8e5687",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const tukeNorthernMoose: LorcanitoCharacterCard = {
//   id: "lu2",
//   name: "Tuke",
//   title: "Northern Moose",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "I'd love a snack, but I'm kinda tied up right now.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Ron Baird",
//   number: 7,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560496,
//   },
//   rarity: "common",
// };
//
