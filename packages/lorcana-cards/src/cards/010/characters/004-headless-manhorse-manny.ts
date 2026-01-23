import type { CharacterCard } from "@tcg/lorcana-types";

export const headlessManhorseManny: CharacterCard = {
  id: "wfp",
  cardType: "character",
  name: "Headless Manhorse",
  version: "Manny",
  fullName: "Headless Manhorse - Manny",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cost: 6,
  strength: 5,
  willpower: 10,
  lore: 1,
  cardNumber: 4,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "74e70de1f6826e8bd5376c54ec0413b7b8a33f2d",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const headlessManhorseManny: LorcanitoCharacterCard = {
//   id: "yjw",
//   name: "Headless Manhorse",
//   title: "Manny",
//   characteristics: ["storyborn", "ally"],
//   text: undefined,
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 5,
//   willpower: 10,
//   illustrator: "Gabriel Quinn / Jules Dubost",
//   number: 4,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660014,
//   },
//   rarity: "common",
//   abilities: [],
//   lore: 1,
// };
//
