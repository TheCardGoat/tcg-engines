import type { CharacterCard } from "@tcg/lorcana-types";

export const ichabodCraneScaredOutOfHisMind: CharacterCard = {
  id: "1dh",
  cardType: "character",
  name: "Ichabod Crane",
  version: "Scared Out of His Mind",
  fullName: "Ichabod Crane - Scared Out of His Mind",
  inkType: ["sapphire"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 2,
  cardNumber: 152,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b25af0694982de814b9abb0e5d87fc1f3c07e581",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ichabodCraneScaredOutOfHisMind: LorcanitoCharacterCard = {
//   id: "sbu",
//   name: "Ichabod Crane",
//   title: "Scared Out of His Mind",
//   characteristics: ["storyborn", "hero"],
//   text: "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.",
//   type: "character",
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 0,
//   willpower: 2,
//   illustrator: "Laura Galiano",
//   number: 152,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660021,
//   },
//   rarity: "uncommon",
//   lore: 2,
//   abilities: [
//     whenThisCharacterBanished({
//       name: "CHILLING TALE",
//       text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [putThisCardIntoYourInkwellExerted],
//     }),
//   ],
// };
//
