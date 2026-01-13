import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineFearlessPrincess: CharacterCard = {
  id: "t89",
  cardType: "character",
  name: "Jasmine",
  version: "Fearless Princess",
  fullName: "Jasmine - Fearless Princess",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "009",
  text: "TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nNOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  cardNumber: 178,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "69586be51cdfb17245c5bc8ebe2efac36a7431f7",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   duringYourTurnGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const jasmineFearlessPrincess: LorcanitoCharacterCard = {
//   id: "a7h",
//   name: "Jasmine",
//   title: "Fearless Princess",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nNOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 3,
//   willpower: 7,
//   illustrator: "Ian MacDonald",
//   number: 178,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650111,
//   },
//   rarity: "rare",
//   abilities: [
//     duringYourTurnGains(
//       "TAKE THE LEAP",
//       "During your turn, this character gains Evasive.",
//       evasiveAbility,
//     ),
//     {
//       type: "activated",
//       name: "NOW'S MY CHANCE",
//       text: "Choose and discard a card — This character gains Challenger +3 this turn.",
//       optional: false,
//       costs: [
//         {
//           type: "card",
//           action: "discard",
//           amount: 1,
//           filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//           ],
//         },
//       ],
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 3,
//           modifier: "add",
//           duration: "turn",
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   lore: 2,
// };
//
