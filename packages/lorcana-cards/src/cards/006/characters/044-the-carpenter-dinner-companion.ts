import type { CharacterCard } from "@tcg/lorcana-types";

export const theCarpenterDinnerCompanion: CharacterCard = {
  id: "pff",
  cardType: "character",
  name: "The Carpenter",
  version: "Dinner Companion",
  fullName: "The Carpenter - Dinner Companion",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "I'LL GET YOU! When this character is banished, you may exert chosen character.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5ba5435695ac12a2a4f8697877c36e2691c34826",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { exertChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theCarpenterDinnerCompanion: LorcanitoCharacterCard = {
//   id: "wn7",
//   missingTestCase: true,
//   name: "The Carpenter",
//   title: "Dinner Companion",
//   characteristics: ["storyborn"],
//   text: "I'LL GET YOU! When this character is banished, you may exert chosen character.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "The Carpenter",
//       text: "When this character is banished, you may exert chosen character.",
//       optional: true,
//       effects: [exertChosenCharacter],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Andrea Parisi",
//   number: 44,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587934,
//   },
//   rarity: "common",
// };
//
