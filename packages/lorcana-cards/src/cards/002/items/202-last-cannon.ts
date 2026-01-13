import type { ItemCard } from "@tcg/lorcana-types";

export const lastCannon: ItemCard = {
  id: "u1y",
  cardType: "item",
  name: "Last Cannon",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "002",
  text: "ARM YOURSELF 1 {I}, Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  cost: 1,
  cardNumber: 202,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6c5152c3b21edb6a64d7891cda39fae29a7ee4e2",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
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
// export const lastCannon: LorcanitoItemCard = {
//   id: "mbx",
//
//   name: "Last Cannon",
//   characteristics: ["item"],
//   text: "**ARM YOURSELF** 1 {I}, Banish this item − Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Arm Yourself",
//       text: "1 {I}, Banish this item − Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
//       costs: [{ type: "banish" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 3,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   flavour: "One shot can change everything.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   illustrator: "Jared Nickerl",
//   number: 202,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527780,
//   },
//   rarity: "common",
// };
//
