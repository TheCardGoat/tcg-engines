import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaWhisperOfVanessa: CharacterCard = {
  id: "86p",
  cardType: "character",
  name: "Ursula",
  version: "Whisper of Vanessa",
  fullName: "Ursula - Whisper of Vanessa",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nSLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive. (Only characters with Evasive can challenge them.)",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 59,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1d80b7ef4fbf39b61830fba896f5c20514ed5e87",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import {
//   whileConditionThisCharacterGains,
//   whileConditionThisCharacterGets,
// } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const ursulaWhisperOfVanessa: LorcanitoCharacterCard = {
//   id: "d2a",
//   missingTestCase: true,
//   name: "Ursula",
//   title: "Whisper of Vanessa",
//   characteristics: ["storyborn", "villain", "sorcerer", "whisper"],
//   text: "Boost 1\n SLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   illustrator: 'Angelina "Spikie" Ricardo',
//   number: 59,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658327,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     boostAbility(1),
//     whileConditionThisCharacterGets({
//       name: "SLIPPERY SPELL",
//       text: "While there's a card under this character, she gets +1 {L}.",
//       conditions: [ifThereIsACardUnder],
//       attribute: "lore",
//       amount: 1,
//     }),
//     whileConditionThisCharacterGains({
//       name: "SLIPPERY SPELL",
//       text: "While there's a card under this character, she gets +1 and gains Evasive.",
//       ability: evasiveAbility,
//       conditions: [ifThereIsACardUnder],
//     }),
//   ],
// };
//
