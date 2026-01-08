import type { CharacterCard } from "@tcg/lorcana-types";

export const theHeadlessHorsemanTerrorOfSleepyHollow: CharacterCard = {
  id: "171",
  cardType: "character",
  name: "The Headless Horseman",
  version: "Terror of Sleepy Hollow",
  fullName: "The Headless Horseman - Terror of Sleepy Hollow",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.\nGATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.",
  cost: 5,
  strength: 4,
  willpower: 2,
  lore: 2,
  cardNumber: 125,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9b2717e50c4c8468b0caaee2036f07b031df02e1",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { eachOfYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverOpposingCharIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const theHeadlessHorsemanTerrorOfSleepyHollow: LorcanitoCharacterCard = {
//   id: "ks2",
//   name: "The Headless Horseman",
//   title: "Terror of Sleepy Hollow",
//   characteristics: ["storyborn", "villain"],
//   text: "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less. GATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 this turn.",
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 2,
//   illustrator: "Andrew Chesworth",
//   number: 125,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660010,
//   },
//   rarity: "legendary",
//   lore: 2,
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "LEAVES NO TRACE",
//       text: "When you play this character, banish chosen opposing character with 2 or less.",
//       optional: true,
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//     wheneverOpposingCharIsBanished({
//       name: "GATHERING STRENGTH",
//       text: "During your turn, whenever an opposing character is banished, each of your characters gets +1 this turn.",
//       conditions: [{ type: "during-turn", value: "self" }],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: eachOfYourCharacters,
//         },
//       ],
//     }),
//   ],
// };
//
