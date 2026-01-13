import type { ActionCard } from "@tcg/lorcana-types";

export const ghostlyTale: ActionCard = {
  id: "z6e",
  cardType: "action",
  name: "Ghostly Tale",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "Exert all opposing characters with 2 {S} or less.",
  cost: 4,
  cardNumber: 132,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ec895bb3d6454e9f1b323a886dc65c897b5a77f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const ghostlyTale: LorcanitoActionCard = {
//   id: "rdc",
//   name: "Ghostly Tale",
//   characteristics: ["action"],
//   text: "Exert all opposing characters with 2 {S} or less.",
//   type: "action",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   illustrator: "Sara Storino",
//   number: 132,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660016,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: false,
//       dependentEffects: false,
//       text: "Exert all opposing characters with 2 {S} or less.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "owner", value: "opponent" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
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
// };
//
