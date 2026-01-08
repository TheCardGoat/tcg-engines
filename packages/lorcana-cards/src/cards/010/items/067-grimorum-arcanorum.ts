import type { ItemCard } from "@tcg/lorcana-types";

export const grimorumArcanorum: ItemCard = {
  id: "177",
  cardType: "item",
  name: "Grimorum Arcanorum",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  text: "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.\nCELERITAS Your characters named Demona gain Rush. (They can challenge the turn they're played.)",
  cost: 3,
  cardNumber: 67,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9dbf9b2d631d70b21894d535fad283d18273b6cd",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   duringOpponentsTurn,
//   duringYourTurn,
// } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const grimorumArcanorum: LorcanitoItemCard = {
//   id: "fvu",
//   name: "Grimorum Arcanorum",
//   characteristics: ["item"],
//   text: "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.\n\nCELERITAS Your characters named Demona gain Rush.",
//   type: "item",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Irish Chua",
//   number: 67,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660360,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "static-triggered",
//       trigger: {
//         on: "exert",
//         target: {
//           type: "card",
//           value: "all",
//           filters: [
//             { filter: "owner", value: "opponent" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       },
//       conditions: [duringYourTurn],
//       name: "DOCTRINA ADDUCERE",
//       text: "During your turn, whenever an opposing character becomes exerted, gain 1 lore.",
//       layer: {
//         type: "resolution",
//         name: "DOCTRINA ADDUCERE",
//         text: "During your turn, whenever an opposing character becomes exerted, gain 1 lore.",
//         conditions: [duringYourTurn],
//         effects: [youGainLore(1)],
//       },
//     },
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "CELERITAS",
//       text: "Your characters named Demona gain Rush.",
//       gainedAbility: rushAbility,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "Demona" },
//           },
//         ],
//       },
//     },
//   ],
// };
//
