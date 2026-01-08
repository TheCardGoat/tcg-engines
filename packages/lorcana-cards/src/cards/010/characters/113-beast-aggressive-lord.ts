import type { CharacterCard } from "@tcg/lorcana-types";

export const beastAggressiveLord: CharacterCard = {
  id: "6u1",
  cardType: "character",
  name: "Beast",
  version: "Aggressive Lord",
  fullName: "Beast - Aggressive Lord",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTHAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 113,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "18a1f83e8dd250ea4790520b1f94314ac9a942dd",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   eachOpponentLosesLore,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const beastAggressiveLord: LorcanitoCharacterCard = {
//   id: "hl5",
//   name: "Beast",
//   title: "Aggressive Lord",
//   characteristics: ["storyborn", "hero", "prince", "whisper"],
//   text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTHAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Juan Diego León",
//   number: 113,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658324,
//   },
//   rarity: "uncommon",
//   abilities: [
//     boostAbility(2),
//     wheneverChallengesAnotherChar({
//       name: "THAT'S MINE",
//       text: "Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
//       conditions: [ifThereIsACardUnder],
//       effects: [eachOpponentLosesLore(1), youGainLore(1)],
//     }),
//   ],
//   lore: 1,
// };
//
