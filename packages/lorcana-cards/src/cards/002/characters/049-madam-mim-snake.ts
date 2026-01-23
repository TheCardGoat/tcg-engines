import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimSnake: CharacterCard = {
  id: "1tb",
  cardType: "character",
  name: "Madam Mim",
  version: "Snake",
  fullName: "Madam Mim - Snake",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ecab4fc40a795437b551bd71d462df6cbe7b0bce",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { madameMimAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const madamMimSnake: LorcanitoCharacterCard = {
//   id: "fo8",
//   name: "Madam Mim",
//   title: "Snake",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**JUST YOU WAIT** When you play this character, banish her or return another chosen character of yours to your hand.",
//   type: "character",
//   abilities: [
//     {
//       ...madameMimAbility,
//       name: "Just You Wait",
//       text: "When you play this character, banish her or return another chosen character of yours to your hand.",
//     },
//   ],
//   flavour: "I’ve got you rattled now!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Brian Weisz",
//   number: 49,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 522651,
//   },
//   rarity: "uncommon",
// };
//
