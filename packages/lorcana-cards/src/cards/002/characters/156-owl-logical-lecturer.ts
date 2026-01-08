import type { CharacterCard } from "@tcg/lorcana-types";

export const owlLogicalLecturer: CharacterCard = {
  id: "1q5",
  cardType: "character",
  name: "Owl",
  version: "Logical Lecturer",
  fullName: "Owl - Logical Lecturer",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "002",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "dfe6a38e469b63500f416689faee62ce3f319149",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const owlLogicalLecturer: LorcanitoCharacterCard = {
//   id: "iei",
//   name: "Owl",
//   title: "Logical Lecturer",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     "For instance, based on the quality of the light and the subtle change in wind direction, I can safely say that it is time for tea.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Agnes Christianson",
//   number: 156,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527278,
//   },
//   rarity: "common",
// };
//
