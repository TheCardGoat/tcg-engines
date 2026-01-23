import type { ItemCard } from "@tcg/lorcana-types";

export const enigmaticInkcaster: ItemCard = {
  id: "pr8",
  cardType: "item",
  name: "Enigmatic Inkcaster",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "010",
  text: "ITS OWN REWARD {E} — If you've played 2 or more cards this turn, gain 1 lore.",
  cost: 2,
  cardNumber: 100,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5cd409752d10d79e8a7c33b9a22eb0f82c1850a3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
//
// export const enigmaticInkcaster: LorcanitoItemCard = {
//   id: "eb0",
//   name: "Enigmatic Inkcaster",
//   characteristics: ["item"],
//   text: "ITS OWN REWARD — If you've played 2 or more cards this turn, gain 1 lore.",
//   type: "item",
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Rizal Badar",
//   number: 100,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659453,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "activated",
//       name: "ITS OWN REWARD",
//       text: "If you've played 2 or more cards this turn, gain 1 lore.",
//       costs: [{ type: "exert" }],
//       conditions: [
//         {
//           type: "played-card",
//           filters: [
//             {
//               filter: "type",
//               value: ["character", "item", "action", "location"],
//             },
//           ],
//           comparison: { operator: "gte", value: 2 },
//         },
//       ],
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//       resolveEffectsIndividually: false,
//       dependentEffects: false,
//     },
//   ],
// };
//
