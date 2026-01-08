import type { LocationCard } from "@tcg/lorcana-types";

export const prideLandsJungleOasis: LocationCard = {
  id: "5wg",
  cardType: "location",
  name: "Pride Lands",
  version: "Jungle Oasis",
  fullName: "Pride Lands - Jungle Oasis",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "005",
  text: "OUR HUMBLE HOME While you have 3 or more characters here, you may banish this location to play a character from your discard for free.",
  cost: 3,
  moveCost: 2,
  lore: 0,
  cardNumber: 34,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "154540891abf203a5959b722088b9cd9d1ee9109",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
//
// export const prideLandsJungleOasis: LorcanitoLocationCard = {
//   id: "peo",
//   name: "Pride Lands",
//   title: "Jungle Oasis",
//   characteristics: ["location"],
//   text: "**OUR HUMBLE HOME** While you have 3 or more characters here, you may banish this location to play a character from your discard for free.",
//   type: "location",
//   abilities: [
//     {
//       type: "activated",
//       name: "**OUR HUMBLE HOME**",
//       text: "While you have 3 or more characters here, you may banish this location to play a character from your discard for free.",
//       costs: [{ type: "banish" }],
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 3 },
//         },
//       ],
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   willpower: 8,
//   lore: 1,
//   illustrator: "Matthew Oates",
//   number: 34,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561189,
//   },
//   rarity: "rare",
//   moveCost: 2,
// };
//
