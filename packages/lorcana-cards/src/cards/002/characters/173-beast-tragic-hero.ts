import type { CharacterCard } from "@tcg/lorcana-types";

export const beastTragicHero: CharacterCard = {
  id: "kyf",
  cardType: "character",
  name: "Beast",
  version: "Tragic Hero",
  fullName: "Beast - Tragic Hero",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Beast.)\nIT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 173,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4b874fe55f677240c7632e1507c8b94e37428079",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const beastTragicHero: LorcanitoCharacterCard = {
//   id: "jhf",
//
//   name: "Beast",
//   title: "Tragic Hero",
//   characteristics: ["hero", "floodborn", "prince"],
//   text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Beast._)\n**IT'S BETTER THIS WAY** At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "beast"),
//     atTheStartOfYourTurn({
//       name: "It's Better this way",
//       text: "At the start of your turn, if this character has no damage, draw a card.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "source", value: "self" },
//             {
//               filter: "status",
//               value: "damage",
//               comparison: { operator: "eq", value: 0 },
//             },
//           ],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [drawACard],
//     }),
//     atTheStartOfYourTurn({
//       name: "It's Better this way",
//       text: "At the start of your turn, if this character has damage, he gets +4 {S} this turn.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "source", value: "self" },
//             {
//               filter: "status",
//               value: "damage",
//               comparison: { operator: "gt", value: 0 },
//             },
//           ],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 4,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: '"It must be my destiny−to remain a beast forever."',
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Evana Kisa",
//   number: 173,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527629,
//   },
//   rarity: "legendary",
// };
//
