import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraSecretKeeper: CharacterCard = {
  id: "1af",
  cardType: "character",
  name: "Megara",
  version: "Secret Keeper",
  fullName: "Megara - Secret Keeper",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nI'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 86,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "04a61e5282af9e9f2fbac7f4793e129af04930c8",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   whileConditionThisCharacterGains,
//   whileConditionThisCharacterGets,
// } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const megaraSecretKeeper: LorcanitoCharacterCard = {
//   id: "siu",
//   name: "Megara",
//   title: "Secret Keeper",
//   characteristics: ["storyborn", "ally", "whisper"],
//   text: "Boost 1\n\nI'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Pauline Voss",
//   number: 86,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 657892,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     boostAbility(1),
//     whileConditionThisCharacterGets({
//       name: "I'LL BE FINE",
//       text: "While there's a card under this character, she gets +1 {L}",
//       conditions: [ifThereIsACardUnder],
//       attribute: "lore",
//       amount: 1,
//     }),
//     whileConditionThisCharacterGains({
//       name: "I'LL BE FINE",
//       text: 'While there\'s a card under this character, she gains "Whenever this character is challenged, each opponent chooses and discards a card."',
//       conditions: [ifThereIsACardUnder],
//       ability: whenChallenged({
//         name: "I'LL BE FINE",
//         text: "Whenever this character is challenged, each opponent chooses and discards a card.",
//         responder: "opponent",
//         effects: [discardACard],
//       }),
//     }),
//   ],
// };
//
