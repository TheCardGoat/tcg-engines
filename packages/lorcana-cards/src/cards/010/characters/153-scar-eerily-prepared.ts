import type { CharacterCard } from "@tcg/lorcana-types";

export const scarEerilyPrepared: CharacterCard = {
  id: "1rg",
  cardType: "character",
  name: "Scar",
  version: "Eerily Prepared",
  fullName: "Scar - Eerily Prepared",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nSURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 153,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4aaeaa0e0dad921e2728069209736326c66473f",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   wheneverYouPutACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const scarEerilyPrepared: LorcanitoCharacterCard = {
//   id: "zn6",
//   name: "Scar",
//   title: "Eerily Prepared",
//   characteristics: ["storyborn", "villain", "whisper"],
//   text: "Boost 2\n SURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 this turn.",
//   type: "character",
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 6,
//   willpower: 5,
//   illustrator: "Lisanne Koeteeuw",
//   number: 153,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659384,
//   },
//   rarity: "super_rare",
//   lore: 2,
//   abilities: [
//     boostAbility(2),
//     wheneverYouPutACardUnder({
//       name: "SURVIVAL OF THE FITTEST",
//       text: "Whenever you put a card under this character, chosen opposing character gets -5 this turn.",
//       effects: [getStrengthThisTurn(-5, chosenOpposingCharacter)],
//     }),
//   ],
// };
//
