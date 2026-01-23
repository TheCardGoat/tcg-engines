import type { ActionCard } from "@tcg/lorcana-types";

export const brawl: ActionCard = {
  id: "axa",
  cardType: "action",
  name: "Brawl",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "004",
  text: "Banish chosen character with 2 {S} or less.",
  cost: 3,
  cardNumber: 130,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "275f6a87f41c07adb1007eb7d1b5a6c177b506c7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const brawl: LorcanitoActionCard = {
//   id: "wsx",
//   name: "Brawl",
//   characteristics: ["action"],
//   text: "Banish chosen character with 2 {S} or less.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Brawl",
//       text: "Banish chosen character with 2 {S} or less.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     "There are two ways to leave the Snuggly Duckling - the door or the window.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "R. la Barbera / L. Giammichele",
//   number: 130,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547776,
//   },
//   rarity: "common",
// };
//
