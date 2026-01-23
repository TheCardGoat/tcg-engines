import type { CharacterCard } from "@tcg/lorcana-types";

export const sleepyNoddingOff: CharacterCard = {
  id: "1e7",
  cardType: "character",
  name: "Sleepy",
  version: "Nodding Off",
  fullName: "Sleepy - Nodding Off",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "YAWN! This character enters play exerted.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 21,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b4eb2bf849d3bb89970a17f46fdc273773c1fe65",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const sleepyNoddingOff: LorcanitoCharacterCard = {
//   id: "w0u",
//   name: "Sleepy",
//   title: "Nodding Off",
//   characteristics: ["storyborn", "ally", "seven dwarfs"],
//   text: "**YAWN!** This character enters play exerted.",
//   type: "character",
//   abilities: [
//     entersPlayExerted({
//       name: "Yawn!",
//     }),
//   ],
//   flavour: "He never gets tired of naps.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Kendall Hale",
//   number: 21,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526366,
//   },
//   rarity: "common",
// };
//
