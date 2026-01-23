import type { LocationCard } from "@tcg/lorcana-types";

export const prideLandsPrideRock: LocationCard = {
  id: "1ph",
  cardType: "location",
  name: "Pride Lands",
  version: "Pride Rock",
  fullName: "Pride Lands - Pride Rock",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "003",
  text: "WE ARE ALL CONNECTED Characters get +2 {W} while here.\nLION HOME If you have a Prince or King character here, you pay 1 {I} less to play characters.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 33,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "df2e59641883d44ec34c12b9ba600f92f8be0ec2",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const prideLandsPrideRock: LorcanitoLocationCard = {
//   id: "e1l",
//   type: "location",
//   missingTestCase: true,
//   name: "Pride Lands",
//   title: "Pride Rock",
//   characteristics: ["location"],
//   text: "**WE ARE ALL CONNECTED** Characters get +2 {W} while here.\n\n\n**LION HOME** If you have a Prince or King character here, you pay 1 {I} less to play characters.",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Lion Home",
//       text: "If you have a Prince or King character here, you pay 1 {I} less to play characters.",
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             {
//               filter: "characteristics",
//               value: ["prince", "king"],
//               conjunction: "or",
//             },
//           ],
//         },
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "cost",
//           amount: 1,
//           modifier: "subtract",
//           duration: "static",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//         },
//       ],
//     },
//     gainAbilityWhileHere({
//       name: "WE ARE ALL CONNECTED",
//       text: "Characters get +2 {W} while here.",
//       ability: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "willpower",
//             amount: 2,
//             modifier: "add",
//             duration: "static",
//             target: {
//               type: "card",
//               value: "all",
//               filters: [{ filter: "source", value: "self" }],
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   colors: ["amber"],
//   cost: 2,
//   willpower: 7,
//   lore: 1,
//   moveCost: 2,
//   illustrator: "Beverly Arce / Jonathan Livslyst",
//   number: 33,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538458,
//   },
//   rarity: "rare",
// };
//
