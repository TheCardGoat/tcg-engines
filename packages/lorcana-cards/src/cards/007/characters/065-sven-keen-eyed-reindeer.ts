import type { CharacterCard } from "@tcg/lorcana-types";

export const svenKeeneyedReindeer: CharacterCard = {
  id: "dna",
  cardType: "character",
  name: "Sven",
  version: "Keen-Eyed Reindeer",
  fullName: "Sven - Keen-Eyed Reindeer",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Rush (This character can challenge the turn they're played.)\nFORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  cardNumber: 65,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "312f59abb5f525980eb98ed6d167aea1da0b2188",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const svenKeeneyedReindeer: LorcanitoCharacterCard = {
//   id: "x18",
//   name: "Sven",
//   title: "Keen-Eyed Reindeer",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//
//   colors: ["amethyst", "sapphire"],
//   cost: 5,
//   strength: 2,
//   willpower: 6,
//   illustrator: "Juan Diego Leon",
//   number: 65,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618135,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   text: "Rush\nFORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.",
//   abilities: [
//     rushAbility,
//     whenYouPlayThisCharacter({
//       name: "Formidable Glare",
//       text: "chosen character gets -3 {S} this turn",
//       effects: [chosenCharacterGetsStrength(-3)],
//     }),
//   ],
// };
//
