import type { CharacterCard } from "@tcg/lorcana-types";

export const nessusRiverGuardian: CharacterCard = {
  id: "16e",
  cardType: "character",
  name: "Nessus",
  version: "River Guardian",
  fullName: "Nessus - River Guardian",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 2,
  cardNumber: 118,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "98d6e4a3fbb055d7727131d403936f6a25c557ae",
  },
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const nessusRiverGuardian: LorcanitoCharacterCard = {
//   id: "qof",
//   name: "Nessus",
//   title: "River Guardian",
//   characteristics: ["storyborn", "villain"],
//   type: "character",
//   flavour:
//     "He sent the eels away when they came with the sea witch's offer. He didn't need her help making trouble.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 7,
//   willpower: 5,
//   illustrator: "Justin Runfola",
//   number: 118,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550595,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
