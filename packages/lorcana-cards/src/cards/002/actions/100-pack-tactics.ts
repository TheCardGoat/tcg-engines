import type { ActionCard } from "@tcg/lorcana-types";

export const packTactics: ActionCard = {
  id: "1iw",
  cardType: "action",
  name: "Pack Tactics",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "002",
  text: "Gain 1 lore for each damaged character opponents have in play.",
  cost: 4,
  cardNumber: 100,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c521d6e9ff9951f603c95de81a152ae766eebcb9",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
// import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const self: PlayerEffectTarget = {
//   type: "player",
//   value: "self",
// };
//
// export const packTactics: LorcanitoActionCard = {
//   id: "yp2",
//
//   name: "Pack Tactics",
//   characteristics: ["action"],
//   text: "Gain 1 lore for each damaged character opponents have in play.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           target: self,
//           amount: {
//             dynamic: true,
//             amount: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               {
//                 filter: "status",
//                 value: "damage",
//                 comparison: { operator: "gte", value: 1 },
//               },
//             ],
//           },
//         } as LoreEffect,
//       ],
//     },
//   ],
//   flavour:
//     "Pacha: You want to survive the jungle? Start thinking like you belong here. \nKuzco: No problem . . . Grrr, look at me, I'm a jaguar.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   illustrator: "Don Aguillo",
//   number: 100,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525311,
//   },
//   rarity: "rare",
// };
//
