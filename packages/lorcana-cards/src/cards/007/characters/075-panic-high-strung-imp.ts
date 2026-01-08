import type { CharacterCard } from "@tcg/lorcana-types";

export const panicHighstrungImp: CharacterCard = {
  id: "bmi",
  cardType: "character",
  name: "Panic",
  version: "High-Strung Imp",
  fullName: "Panic - High-Strung Imp",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "007",
  text: "STARTLED SHRIEK When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 75,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "29e6560843c19488f858e257358e01b036237875",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const paniqueTenseImp: LorcanitoCharacterCard = {
//   id: "fin",
//   name: "Panic",
//   title: "High-Strung Imp",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Arianna Rea",
//   number: 75,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618699,
//   },
//   rarity: "common",
//   lore: 2,
//   text: "Startled Shriek When you play this character, you can move up to 2 damage counters from chosen character to chosen opposing character.",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "Startled Shriek",
//       text: "When you play this character, you can move up to 2 damage counters from chosen character to chosen opposing character.",
//       effects: [
//         moveDamageEffect({
//           amount: 2,
//           from: chosenCharacter,
//           to: chosenOpposingCharacter,
//           upTo: true,
//         }),
//       ],
//     }),
//   ],
// };
//
