import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderConfidentVagabond: CharacterCard = {
  id: "hwo",
  cardType: "character",
  name: "Flynn Rider",
  version: "Confident Vagabond",
  fullName: "Flynn Rider - Confident Vagabond",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "002",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 81,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "408a955dc902338bf10c87c78906b1ddb5c84045",
  },
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const flynnRiderConfidentVagabond: LorcanitoCharacterCard = {
//   id: "nzv",
//   name: "Flynn Rider",
//   title: "Confident Vagabond",
//   characteristics: ["hero", "storyborn", "prince"],
//   type: "character",
//   flavour:
//     '"I love a good fan club, but they could at least <b>try</b> to get the nose right!"',
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Ron Baird",
//   number: 81,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 517453,
//   },
//   rarity: "common",
// };
//
