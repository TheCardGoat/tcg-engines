import type { CharacterCard } from "@tcg/lorcana-types";

export const shenziScarsAccomplice: CharacterCard = {
  id: "1nr",
  cardType: "character",
  name: "Shenzi",
  version: "Scar's Accomplice",
  fullName: "Shenzi - Scar's Accomplice",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nEASY PICKINGS While challenging a damaged character, this character gets +2 {S}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 70,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d76d53b25e89ba4480b569e40a9053d73d50bb2f",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Hyena"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   challengerAbility,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// export const shenziScarsAccomplice: LorcanitoCharacterCard = {
//   id: "b08",
//   missingTestCase: true,
//   name: "Shenzi",
//   title: "Scar's Accomplice",
//   characteristics: ["storyborn", "ally", "hyena"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_ **EASY PICKINGS** While challenging a damaged character, this character gets +2 {S}.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverChallengesAnotherChar({
//       name: "EASY PICKINGS",
//       text: "While challenging a damaged character, this character gets +2 {S}.",
//       defenderFilter: [
//         {
//           filter: "type",
//           value: "character",
//         },
//         {
//           filter: "zone",
//           value: "play",
//         },
//         {
//           filter: "status",
//           value: "damage",
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [
//         {
//           type: "ability",
//           ability: "custom",
//           customAbility: challengerAbility(2),
//           modifier: "add",
//           amount: 2,
//           duration: "challenge",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               {
//                 filter: "challenge",
//                 value: "attacker",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Julien Vandois",
//   number: 70,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561955,
//   },
//   rarity: "uncommon",
// };
//
