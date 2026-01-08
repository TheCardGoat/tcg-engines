import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinCompletingHisResearch: CharacterCard = {
  id: "mr7",
  cardType: "character",
  name: "Merlin",
  version: "Completing His Research",
  fullName: "Merlin - Completing His Research",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nLEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 2,
  cardNumber: 58,
  inkable: false,
  externalIds: {
    ravensburger: "5203ac82e44d01fa635507539a18d68b70569ca4",
  },
  abilities: [
    {
      id: "mr7-1",
      type: "keyword",
      keyword: "Boost",
      value: 2,
      text: "Boost 2 {I}",
    },
    {
      id: "mr7-2",
      type: "triggered",
      name: "LEGACY OF LEARNING",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "he had a card under him",
        },
        then: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
      },
      text: "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   ifThereIsACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const merlinCompletingHisResearch: LorcanitoCharacterCard = {
//   id: "vd0",
//   name: "Merlin",
//   title: "Completing His Research",
//   characteristics: ["storyborn", "mentor", "sorcerer", "whisper"],
//   text: "Boost 2 {I}\n\nLEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
//   type: "character",
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 0,
//   willpower: 3,
//   illustrator: "Gaku Kumatori",
//   number: 58,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659597,
//   },
//   rarity: "uncommon",
//   lore: 2,
//   abilities: [
//     boostAbility(2),
//     whenThisCharacterBanishedInAChallenge({
//       name: "LEGACY OF LEARNING",
//       text: "When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
//       conditions: [ifThereIsACardUnder],
//       effects: [drawXCards(2)],
//     }),
//   ],
// };
//
