import type { ActionCard } from "@tcg/lorcana-types";

export const quickPatch: ActionCard = {
  id: "r4j",
  cardType: "action",
  name: "Quick Patch",
  inkType: ["amber"],
  franchise: "Talespin",
  set: "003",
  text: "Remove up to 3 damage from chosen location.",
  cost: 1,
  cardNumber: 27,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "61c39a8f8d441689638761be897e2f215f6def30",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const quickPatch: LorcanitoActionCard = {
//   id: "p6z",
//   missingTestCase: true,
//   name: "Quick Patch",
//   characteristics: ["action"],
//   text: "Remove up to 3 damage from chosen location.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "heal",
//           amount: 3,
//           upTo: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "location" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Good as new! Well, almost.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Wouter Bruneel",
//   number: 27,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538310,
//   },
//   rarity: "common",
// };
//
