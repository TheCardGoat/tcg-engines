import type { ActionCard } from "@tcg/lorcana-types";

export const spookySight: ActionCard = {
  id: "1cd",
  cardType: "action",
  name: "Spooky Sight",
  inkType: ["sapphire"],
  set: "010",
  text: "Put all characters with cost 3 or less into their players' inkwells facedown and exerted.",
  cost: 6,
  cardNumber: 165,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "04d9c5d3320bafed8acb9a5cc82ba4571040032d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { withCostXorLess } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const spookySight: LorcanitoActionCard = {
//   id: "ndd",
//   name: "Spooky Sight",
//   characteristics: ["action"],
//   text: "Put all characters with cost 3 or less into their players' inkwells facedown and exerted.",
//   type: "action",
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 6,
//   illustrator: "Mariana Moreno",
//   number: 165,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660005,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Spooky Sight",
//       text: "Put all characters with cost 3 or less into their players' inkwells facedown and exerted.",
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               withCostXorLess(3),
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
