import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanArmoredFighter: CharacterCard = {
  id: "1no",
  cardType: "character",
  name: "Mulan",
  version: "Armored Fighter",
  fullName: "Mulan - Armored Fighter",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  cardNumber: 189,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "d7114e7a4426e7b0c237363dd0c72b71183ddbe2",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const mulanArmoredFighter: LorcanitoCharacterCard = {
//   id: "v1e",
//   name: "Mulan",
//   title: "Armored Fighter",
//   characteristics: ["hero", "storyborn", "princess"],
//   type: "character",
//   flavour:
//     "Maybe what I really wanted was to prove I could do things right, so when I looked in the mirror, I'd see someone worthwhile.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Amber Kommavongsa",
//   number: 189,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550619,
//   },
//   rarity: "uncommon",
// };
//
