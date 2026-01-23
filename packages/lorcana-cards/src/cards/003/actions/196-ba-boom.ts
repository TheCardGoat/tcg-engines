import type { ActionCard } from "@tcg/lorcana-types";

export const baboom: ActionCard = {
  id: "1it",
  cardType: "action",
  name: "Ba-Boom!",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "003",
  text: "Deal 2 damage to chosen character or location.",
  cost: 2,
  cardNumber: 196,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c59c3bcfed28db27429200453a290d6c6b63217c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   DamageEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
//
// export const baBoom: LorcanitoActionCard = {
//   id: "oaj",
//   name: "Ba-Boom!",
//   characteristics: ["action"],
//   text: "Deal 2 damage to chosen character or location.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Ba-Boom!",
//       text: "Deal 2 damage to chosen character or location.",
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["location", "character"] },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         } as DamageEffect,
//       ],
//     },
//   ],
//   flavour: "Bigger than your average boom!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Heidi Neunhoffer",
//   number: 196,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537636,
//   },
//   rarity: "common",
// };
//
