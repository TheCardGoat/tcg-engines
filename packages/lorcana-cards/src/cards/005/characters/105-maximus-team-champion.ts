import type { CharacterCard } from "@tcg/lorcana-types";

export const maximusTeamChampion: CharacterCard = {
  id: "p5e",
  cardType: "character",
  name: "Maximus",
  version: "Team Champion",
  fullName: "Maximus - Team Champion",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "005",
  text: "ROYALLY BIG REWARDS At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 105,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5aa4a5a95aa496e560025d060007f42140401cae",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const maximusTeamChampion: LorcanitoCharacterCard = {
//   id: "cw2",
//   name: "Maximus",
//   title: "Team Champion",
//   characteristics: ["storyborn", "ally"],
//   text: "**A REWARD WORTHY OF A KING** At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.",
//   type: "character",
//   abilities: [
//     atTheEndOfYourTurn({
//       name: "A Reward Worthy of a King",
//       text: "At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             ...chosenCharacterOfYours.filters,
//             {
//               filter: "attribute",
//               value: "strength",
//               comparison: { operator: "gte", value: 5 },
//             },
//           ],
//         },
//       ],
//       effects: [youGainLore(2)],
//     }),
//     atTheEndOfYourTurn({
//       name: "A Reward Worthy of a King",
//       text: "At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             ...chosenCharacterOfYours.filters,
//             {
//               filter: "attribute",
//               value: "strength",
//               comparison: { operator: "gte", value: 10 },
//             },
//           ],
//         },
//       ],
//       effects: [youGainLore(3)],
//     }),
//   ],
//   flavour: "It's easy to get carried away when it comes to tug of war.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Federico Maria Cugiari",
//   number: 105,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561961,
//   },
//   rarity: "super_rare",
// };
//
