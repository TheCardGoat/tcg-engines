import type { CharacterCard } from "@tcg/lorcana-types";

export const zeusMissingHisSpark: CharacterCard = {
  id: "gow",
  cardType: "character",
  name: "Zeus",
  version: "Missing His Spark",
  fullName: "Zeus - Missing His Spark",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nI NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 193,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3c2843037115624815f788a3839c897be567da2b",
  },
  abilities: [],
  classifications: ["Storyborn", "King", "Deity", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const zeusMissingHisSpark: LorcanitoCharacterCard = {
//   id: "hlw",
//   name: "Zeus",
//   title: "Missing His Spark",
//   characteristics: ["storyborn", "king", "deity", "whisper"],
//   text: "Boost 2 (Once during your turn, you may pay 2 to put the top card of your deck facedown under this character.) I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Otto Paredes",
//   number: 193,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659387,
//   },
//   rarity: "uncommon",
//   abilities: [
//     boostAbility(2),
//     whileConditionThisCharacterGets({
//       name: "I NEED MORE THUNDERBOLTS!",
//       text: "While there's a card under this character, he gets +2 {S} and +2 {W}.",
//       conditions: [ifThereIsACardUnder],
//       attribute: "strength",
//       amount: 2,
//     }),
//     whileConditionThisCharacterGets({
//       name: "I NEED MORE THUNDERBOLTS!",
//       text: "While there's a card under this character, he gets +2 {S} and +2 {W}.",
//       conditions: [ifThereIsACardUnder],
//       attribute: "willpower",
//       amount: 2,
//     }),
//   ],
//   lore: 2,
// };
//
