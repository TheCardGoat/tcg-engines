import type { ActionCard } from "@tcg/lorcana-types";

export const repair: ActionCard = {
  id: "1sg",
  cardType: "action",
  name: "Repair",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "003",
  text: "Remove up to 3 damage from one of your locations or characters.",
  cost: 2,
  cardNumber: 162,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e8a7d6f2bc4132a0f764d5e084371ff67d21a516",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const repair: LorcanitoActionCard = {
//   id: "wr7",
//   missingTestCase: true,
//   name: "Repair",
//   characteristics: ["action"],
//   text: "Remove up to 3 damage from one of your locations or characters.",
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
//               { filter: "type", value: ["location", "character"] },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "I'm thinkin' about opening a shop here. What do you think?",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Denny Minonne",
//   number: 162,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538305,
//   },
//   rarity: "common",
// };
//
