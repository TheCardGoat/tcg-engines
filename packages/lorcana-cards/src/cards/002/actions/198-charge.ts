import type { ActionCard } from "@tcg/lorcana-types";

export const charge: ActionCard = {
  id: "a71",
  cardType: "action",
  name: "Charge!",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
  cost: 2,
  cardNumber: 198,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "24beb0fe8c03ee0a1b7062c3babb64cb44f8dd73",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
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
// export const charge: LorcanitoActionCard = {
//   id: "koq",
//   name: "Charge!",
//   characteristics: ["action"],
//   text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Charge",
//       text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         } as AbilityEffect,
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   flavour: "Sometimes subtlety is required. This is not one of those times.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Hedvig Häggman-Sund",
//   number: 198,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527639,
//   },
//   rarity: "common",
// };
//
