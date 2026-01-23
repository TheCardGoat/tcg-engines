import type { ActionCard } from "@tcg/lorcana-types";

export const voyage: ActionCard = {
  id: "1cl",
  cardType: "action",
  name: "Voyage",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  text: "Move up to 2 characters of yours to the same location for free.",
  cost: 1,
  cardNumber: 131,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "af9346263084f8db2def377ca5195d0e6c557948",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { moveToLocation } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const voyage: LorcanitoActionCard = {
//   id: "y55",
//   name: "Voyage",
//   characteristics: ["action"],
//   text: "Move up to 2 characters of yours to the same location for free.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         moveToLocation({
//           type: "card",
//           value: 2,
//           upTo: true,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//         }),
//       ],
//     },
//   ],
//   flavour: "We were voyagers! Why'd we stop? –Moana",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Alex Shin",
//   number: 131,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537384,
//   },
//   rarity: "common",
// };
//
