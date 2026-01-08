import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodArcheryContestant: CharacterCard = {
  id: "t9f",
  cardType: "character",
  name: "Robin Hood",
  version: "Archery Contestant",
  fullName: "Robin Hood - Archery Contestant",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  text: "TRICK SHOT When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 77,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "69760a52254a4b56186ccc0f1cfde2cf2162aa32",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const robinHoodArcheryContestant: LorcanitoCharacterCard = {
//   id: "by3",
//   missingTestCase: true,
//   name: "Robin Hood",
//   title: "Archery Contestant",
//   characteristics: ["hero", "storyborn"],
//   text: "**TRICK SHOT** When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "**TRICK SHOT**",
//       text: "When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
//       resolutionConditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "opponent" },
//             {
//               filter: "status",
//               value: "damage",
//               comparison: { operator: "gte", value: 1 },
//             },
//           ],
//         },
//       ],
//       effects: [youGainLore(1)],
//     },
//   ],
//   flavour: "For a second there, I thought this might be a real challenge.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Oggy Christiansson",
//   number: 77,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561956,
//   },
//   rarity: "common",
// };
//
