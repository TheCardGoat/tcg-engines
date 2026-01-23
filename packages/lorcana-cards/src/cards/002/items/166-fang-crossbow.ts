import type { ItemCard } from "@tcg/lorcana-types";

export const fangCrossbow: ItemCard = {
  id: "166",
  cardType: "item",
  name: "Fang Crossbow",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.\nSTAY BACK! {E}, Banish this item — Banish chosen Dragon character.",
  cost: 3,
  cardNumber: 166,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9a04995b8adf69799180f04a035f3cabff2cfec9",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// export const fangCrossbow: LorcanitoItemCard = {
//   id: "ob5",
//
//   name: "Fang Crossbow",
//   characteristics: ["item"],
//   text: "**CAREFUL AIM** {E}, 2 {I} – Chosen character gets -2 {S} this turn.\n\n**STAY BACK!** {E}, Banish this item – Banish chosen Dragon character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Careful Aim",
//       text: "{E}, 2 {I} – Chosen character gets -2 {S} this turn.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//     {
//       type: "activated",
//       name: "Stay Back!",
//       text: "{E}, Banish this item – Banish chosen Dragon character.",
//       costs: [{ type: "exert" }, { type: "banish" }],
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["dragon"] },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   illustrator: "Antonia Flechsig",
//   number: 166,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 520860,
//   },
//   rarity: "uncommon",
// };
//
