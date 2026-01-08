import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsUncoveringClues: CharacterCard = {
  id: "1mf",
  cardType: "character",
  name: "Judy Hopps",
  version: "Uncovering Clues",
  fullName: "Judy Hopps - Uncovering Clues",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  text: "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d2903ad2de30eb97d60047da81f4ec15b1bcbb13",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const judyHoppsUncoveringClues: LorcanitoCharacterCard = {
//   id: "kmd",
//   name: "Judy Hopps",
//   title: "Uncovering Clues",
//   characteristics: ["storyborn", "hero", "detective"],
//   text: "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Jennifer Park",
//   number: 156,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 653916,
//   },
//   rarity: "super_rare",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "THOROUGH INVESTIGATION",
//       text: "When you play this character, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 3,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: {
//             type: "player",
//             value: "self",
//           },
//           limits: {
//             bottom: 3,
//             inkwell: 0,
//             top: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "type", value: "character" },
//             { filter: "characteristics", value: ["detective"] },
//           ],
//         },
//       ],
//     }),
//     wheneverThisCharacterQuests({
//       name: "THOROUGH INVESTIGATION",
//       text: "Whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 3,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: {
//             type: "player",
//             value: "self",
//           },
//           limits: {
//             bottom: 3,
//             inkwell: 0,
//             top: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "type", value: "character" },
//             { filter: "characteristics", value: ["detective"] },
//           ],
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
