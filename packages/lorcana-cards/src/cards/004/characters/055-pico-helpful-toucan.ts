import type { CharacterCard } from "@tcg/lorcana-types";

export const picoHelpfulToucan: CharacterCard = {
  id: "b0z",
  cardType: "character",
  name: "Pico",
  version: "Helpful Toucan",
  fullName: "Pico - Helpful Toucan",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 55,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "27be5df4d628d5a4e6cf0eb59be64a452c0bb9cc",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const picoHelpfulToucan: LorcanitoCharacterCard = {
//   id: "xxo",
//   name: "Pico",
//   title: "Helpful Toucan",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     "He spotted a mysterious glow in the mountains nearby. Could it be the missing piece of the prophecy?",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Hadjie Joos",
//   number: 55,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550569,
//   },
//   rarity: "common",
// };
//
