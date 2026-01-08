import type { CharacterCard } from "@tcg/lorcana-types";

export const dellaDuckReturningMother: CharacterCard = {
  id: "27n",
  cardType: "character",
  name: "Della Duck",
  version: "Returning Mother",
  fullName: "Della Duck - Returning Mother",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 22,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0038b4628fb52601c11e7c7feca10740c56f09d8",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { readyAndCantQuestOrChallenge } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const dellaDuckReturningMother: LorcanitoCharacterCard = {
//   id: "vb0",
//   name: "Della Duck",
//   title: "Returning Mother",
//   characteristics: ["storyborn", "ally"],
//   text: "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   illustrator: "Jiahui Eva Gao",
//   number: 22,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658334,
//   },
//   rarity: "common",
//   lore: 2,
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "HERE TO HELP",
//       text: "When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
//       optional: true,
//       effects: readyAndCantQuestOrChallenge({
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "ability", value: "booster" },
//         ],
//       }),
//     }),
//   ],
// };
//
