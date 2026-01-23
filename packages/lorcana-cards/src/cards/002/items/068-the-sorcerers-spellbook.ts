import type { ItemCard } from "@tcg/lorcana-types";

export const theSorcerersSpellbook: ItemCard = {
  id: "1pk",
  cardType: "item",
  name: "The Sorcerer's Spellbook",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "002",
  text: "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.",
  cost: 3,
  cardNumber: 68,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc6543d1125aab8c86e10f0d622bc9608042ca5c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const theSorcerersSpellbook: LorcanitoItemCard = {
//   id: "gdz",
//
//   name: "The Sorcerer's Spellbook",
//   characteristics: ["item"],
//   text: "**KNOWLEDGE** {E}, 1 {I} − Gain 1 lore.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Knowledge",
//       text: "{E}, 1 {I} − Gain 1 lore.",
//       optional: false,
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "lore",
//           amount: 1,
//           modifier: "add",
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Illumineers seek the power of knowledge−but must be aware of the price.",
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Julie Vu",
//   number: 68,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516340,
//   },
//   rarity: "rare",
// };
//
