import type { ActionCard } from "@tcg/lorcana-types";

export const gruesomeAndGrim: ActionCard = {
  id: "3l1",
  cardType: "action",
  name: "Gruesome and Grim",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 62,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0ceaf8b26eaa49286c3c303758df6db50f061901",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { TriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
// import type {
//   AbilityEffect,
//   BanishEffect,
// } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const targetTriggerCard: CardEffectTarget = {
//   type: "card",
//   value: "all",
//   filters: [{ filter: "source", value: "trigger" }],
// };
//
// const banishSelf: BanishEffect = {
//   type: "banish",
//   target: targetTriggerCard,
// };
//
// const atEndOfTurnBanishItself: TriggeredAbility = atTheEndOfYourTurn({
//   effects: [banishSelf],
// });
//
// export const gruesomeAndGrim: LorcanitoActionCard = {
//   id: "zcv",
//   name: "Gruesome And Grim",
//   characteristics: ["action", "song"],
//   text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nPlay a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Gruesome And Grim",
//       text: "Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them.",
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 4 },
//               },
//             ],
//           },
//         },
//         {
//           type: "ability",
//           ability: "rush",
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "target" }],
//           },
//         } as AbilityEffect,
//         {
//           type: "ability",
//           ability: "custom",
//           modifier: "add",
//           duration: "turn",
//           customAbility: atEndOfTurnBanishItself,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "target" }],
//           },
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Mariana Moreno",
//   number: 62,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525344,
//   },
//   rarity: "rare",
// };
//
