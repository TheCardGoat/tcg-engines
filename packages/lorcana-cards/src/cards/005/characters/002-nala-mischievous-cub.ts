import type { CharacterCard } from "@tcg/lorcana-types";

export const nalaMischievousCub: CharacterCard = {
  id: "1m5",
  cardType: "character",
  name: "Nala",
  version: "Mischievous Cub",
  fullName: "Nala - Mischievous Cub",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "005",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "d157b0da6c78bd4595a8ec024848d4a5d27f0244",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const nalaMischievousCub: LorcanitoCharacterCard = {
//   id: "wow",
//   name: "Nala",
//   title: "Mischievous Cub",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "The Lorcana Hide-and-Seek Championship was hers for the taking.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   willpower: 4,
//   strength: 0,
//   lore: 1,
//   illustrator: "Shannon Hallstein",
//   number: 2,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561595,
//   },
//   rarity: "uncommon",
// };
//
