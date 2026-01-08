import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatInexplicable: CharacterCard = {
  id: "u5d",
  cardType: "character",
  name: "Cheshire Cat",
  version: "Inexplicable",
  fullName: "Cheshire Cat - Inexplicable",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nIT'S LOADS OF FUN Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 60,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6ca8fed019555f17fff25a67cb189d3e060bdfc9",
  },
  abilities: [],
  classifications: ["Storyborn", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   wheneverYouPutACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const cheshireCatInexplicable: LorcanitoCharacterCard = {
//   id: "vhg",
//   name: "Cheshire Cat",
//   title: "Inexplicable",
//   characteristics: ["storyborn", "whisper"],
//   text: "Boost 2 \nIT'S LOADS OF FUN Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Alice Pisoni",
//   number: 60,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659412,
//   },
//   rarity: "super_rare",
//   lore: 1,
//   abilities: [
//     boostAbility(2),
//     wheneverYouPutACardUnder({
//       name: "IT'S LOADS OF FUN",
//       text: "Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//       optional: true,
//       effects: [
//         {
//           type: "move-damage",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//           to: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
// };
//
