import type { LocationCard } from "@tcg/lorcana-types";

export const snugglyDucklingDisreputablePub: LocationCard = {
  id: "1o0",
  cardType: "location",
  name: "Snuggly Duckling",
  version: "Disreputable Pub",
  fullName: "Snuggly Duckling - Disreputable Pub",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "004",
  text: "ROUTINE RUCKUS Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 135,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d8442ef512485e4740ec831c0beeb50cf8069b5c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const snugglyDucklingDisreputablePub: LorcanitoLocationCard = {
//   id: "ut6",
//   name: "Snuggly Duckling",
//   title: "Disreputable Pub",
//   characteristics: ["location"],
//   text: "**ROUTINE RUCKUS** Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Routine Ruckus",
//       text: "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
//       ability: wheneverChallengesAnotherChar({
//         name: "Routine Ruckus",
//         text: "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
//         attackerFilters: [
//           {
//             filter: "attribute",
//             value: "strength",
//             comparison: { operator: "gte", value: 3 },
//           },
//           {
//             filter: "attribute",
//             value: "strength",
//             comparison: { operator: "lt", value: 6 },
//           },
//         ],
//         effects: [youGainLore(1)],
//       }),
//     }),
//     gainAbilityWhileHere({
//       name: "Routine Ruckus",
//       text: "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
//       ability: wheneverChallengesAnotherChar({
//         name: "Routine Ruckus",
//         text: "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
//         attackerFilters: [
//           {
//             filter: "attribute",
//             value: "strength",
//             comparison: { operator: "gte", value: 6 },
//           },
//         ],
//         effects: [youGainLore(3)],
//       }),
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   moveCost: 2,
//   willpower: 9,
//   illustrator: "Roberto Gatto",
//   number: 135,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547777,
//   },
//   // Not sure
//   rarity: "rare",
// };
//
