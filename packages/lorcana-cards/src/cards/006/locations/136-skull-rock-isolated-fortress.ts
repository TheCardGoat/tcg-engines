import type { LocationCard } from "@tcg/lorcana-types";

export const skullRockIsolatedFortress: LocationCard = {
  id: "1rj",
  cardType: "location",
  name: "Skull Rock",
  version: "Isolated Fortress",
  fullName: "Skull Rock - Isolated Fortress",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "006",
  text: "FAMILIAR GROUND Characters get +1 {S} while here.\nSAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e456aa982e0a7666b3635ba389f60fac92eb572b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const skullRockIsolatedFortress: LorcanitoLocationCard = {
//   id: "sv6",
//   missingTestCase: true,
//   name: "Skull Rock",
//   title: "Isolated Fortress",
//   characteristics: [],
//   text: "FAMILIAR GROUND Characters get +1 {S} while here.\nSAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Family Ground",
//       text: "Characters get +1 {S} while here.",
//       ability: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "strength",
//             amount: 1,
//             modifier: "add",
//             duration: "static",
//             target: thisCharacter,
//           },
//         ],
//       },
//     }),
//     atTheStartOfYourTurn({
//       name: "Safe Haven",
//       text: "At the start of your turn, if you have a Pirate character here, gain 1 lore.",
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             {
//               filter: "characteristics",
//               value: ["pirate"],
//             },
//           ],
//         },
//       ],
//       effects: [youGainLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   willpower: 6,
//   moveCost: 1,
//   illustrator: "Nicolas Ky",
//   number: 136,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591987,
//   },
//   rarity: "common",
// };
//
