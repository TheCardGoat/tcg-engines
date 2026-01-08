import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaDeterminedExplorer: CharacterCard = {
  id: "1rz",
  cardType: "character",
  name: "Moana",
  version: "Determined Explorer",
  fullName: "Moana - Determined Explorer",
  inkType: ["amber"],
  franchise: "Moana",
  set: "005",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 18,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "e6a16884d3a180a9a112b8005b0067ebbaccd869",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const moanaDeterminedExplorer: LorcanitoCharacterCard = {
//   id: "sc1",
//   name: "Moana",
//   title: "Determined Explorer",
//   characteristics: ["hero", "storyborn", "princess"],
//   type: "character",
//   flavour:
//     "Investigate every part of the Illuminary, find the chromicons, restore the Illuminary, how hard can it–wait, what was that noise?",
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Isabella Ceravolo",
//   number: 18,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561602,
//   },
//   rarity: "rare",
// };
//
