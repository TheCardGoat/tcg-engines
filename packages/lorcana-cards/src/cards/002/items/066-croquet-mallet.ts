import type { ItemCard } from "@tcg/lorcana-types";

export const croquetMallet: ItemCard = {
  id: "1s8",
  cardType: "item",
  name: "Croquet Mallet",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 1,
  cardNumber: 66,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e970bdbe2afc322fb9f32c852422fe71892d93a6",
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
// export const croquetMallet: LorcanitoItemCard = {
//   id: "kn8",
//
//   name: "Croquet Mallet",
//   characteristics: ["item"],
//   text: "**HURTLING HEDGEHOG** Banish this item − Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Hurtling Hedgehog",
//       text: "Banish this item − Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "rush",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   colors: ["amethyst"],
//   cost: 1,
//   illustrator: "Matt Chapman",
//   number: 66,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527741,
//   },
//   rarity: "common",
// };
//
