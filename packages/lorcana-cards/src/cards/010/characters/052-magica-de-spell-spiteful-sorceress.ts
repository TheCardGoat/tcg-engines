import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellSpitefulSorceress: CharacterCard = {
  id: "qv8",
  cardType: "character",
  name: "Magica De Spell",
  version: "Spiteful Sorceress",
  fullName: "Magica De Spell - Spiteful Sorceress",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "MYSTICAL MANIPULATION Whenever you put a card under one of your characters or locations, you may move 1 damage counter from chosen character to chosen opposing character.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 52,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "60d540eab83ee4737663f810a39c31c42fad8799",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverYouPutACardUnder } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/target";
// import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const magicaDeSpellSpitefulSorceress: LorcanitoCharacterCard = {
//   id: "sfu",
//   name: "Magica De Spell",
//   title: "Spiteful Sorceress",
//   characteristics: ["storyborn", "villain", "sorcerer"],
//   text: "MYSTICAL MANIPULATION Whenever you put a card under one of your characters or locations, you may move 1 damage counter from chosen character to chosen opposing character.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 6,
//   illustrator: "Matteo Marzocco",
//   number: 52,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659458,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     wheneverYouPutACardUnder({
//       name: "MYSTICAL MANIPULATION",
//       text: "Whenever you put a card under one of your characters or locations, you may move 1 damage counter from chosen character to chosen opposing character.",
//       optional: true,
//       effects: [
//         moveDamageEffect({
//           amount: 1,
//           from: chosenCharacter,
//           to: chosenOpposingCharacter,
//         }),
//       ],
//     }),
//   ],
// };
//
