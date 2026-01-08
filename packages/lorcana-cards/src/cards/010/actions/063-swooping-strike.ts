import type { ActionCard } from "@tcg/lorcana-types";

export const swoopingStrike: ActionCard = {
  id: "12u",
  cardType: "action",
  name: "Swooping Strike",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Each opponent chooses and exerts one of their ready characters.",
  cost: 1,
  cardNumber: 63,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8c011159ccf62b8092245040e8ac73e0c37b975d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const swoopingStrike: LorcanitoActionCard = {
//   id: "r3n",
//   name: "Swooping Strike",
//   characteristics: ["action"],
//   text: "Each opponent chooses and exerts one of their ready characters.",
//   type: "action",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   illustrator: "Gabriel Nascimento",
//   number: 63,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659417,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       responder: "opponent",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               {
//                 filter: "zone",
//                 value: "play",
//               },
//               {
//                 filter: "owner",
//                 value: "self",
//               },
//               { filter: "status", value: "ready" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
