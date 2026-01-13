import type { CharacterCard } from "@tcg/lorcana-types";

export const frecklesGoodBoy: CharacterCard = {
  id: "1v6",
  cardType: "character",
  name: "Freckles",
  version: "Good Boy",
  fullName: "Freckles - Good Boy",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 168,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f21c908b247d9cbe4e6848d00540186be031c963",
  },
  abilities: [],
  classifications: ["Storyborn", "Puppy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const frecklesGoodBoy: LorcanitoCharacterCard = {
//   id: "i2s",
//   name: "Freckles",
//   title: "Good Boy",
//   characteristics: ["storyborn", "puppy"],
//   text: "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "JUST SO CUTE!",
//       text: "When you play this character, chosen opposing character gets -1 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           duration: "turn",
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Laura Pauselli",
//   number: 168,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619502,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
