import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderSpectralScoundrel: CharacterCard = {
  id: "73r",
  cardType: "character",
  name: "Flynn Rider",
  version: "Spectral Scoundrel",
  fullName: "Flynn Rider - Spectral Scoundrel",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck face down under this character.)\nI'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 81,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "199b453a94bfd0c69aa0dc8fb017ff359ae33fe0",
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
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const flynnRiderSpectralScoundrel: LorcanitoCharacterCard = {
//   id: "l5c",
//   missingTestCase: true,
//   name: "Flynn Rider",
//   title: "Spectral Scoundrel",
//   characteristics: ["storyborn", "hero", "prince", "whisper"],
//   text: "Boost 2\n\n I'LL TAKE THAT While there's a card under this character, he gets +2 {S} and +1 {L}.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Gaku Kumatori",
//   number: 81,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659452,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   abilities: [
//     boostAbility(2),
//     whileConditionThisCharacterGets({
//       name: "I'LL TAKE THAT",
//       text: "While there's a card under this character, he gets +2 {S}.",
//       conditions: [ifThereIsACardUnder],
//       attribute: "strength",
//       amount: 2,
//     }),
//     whileConditionThisCharacterGets({
//       name: "I'LL TAKE THAT",
//       text: "While there's a card under this character, he gets +1 {L}.",
//       conditions: [ifThereIsACardUnder],
//       attribute: "lore",
//       amount: 1,
//     }),
//   ],
// };
//
