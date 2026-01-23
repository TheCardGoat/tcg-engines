// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import {
//   drawXCards,
//   mayBanish,
// } from "@lorcanito/lorcana-engine/effects/effects";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacterOfYours: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "owner", value: "self" },
//   ],
// };
//
// export const dinnerBell: LorcanitoItemCard = {
//   id: "s78",
//   reprints: ["box"],
//
//   name: "Dinner Bell",
//   characteristics: ["item"],
//   text: "**YOU KNOW WHAT HAPPENS** {E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "You Know What Happens",
//       text: "{E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "create-layer-based-on-target",
//           target: chosenCharacterOfYours,
//           resolveAmountBeforeCreatingLayer: true,
//           effects: [
//             drawXCards({
//               dynamic: true,
//               target: { attribute: "damage" },
//             }),
//           ],
//         },
//         mayBanish(chosenCharacterOfYours),
//       ],
//     },
//   ],
//
//   flavour: "The delicate sound of impending doom.",
//   colors: ["ruby"],
//   cost: 4,
//   illustrator: "Peter Brockhammer",
//   number: 134,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516420,
//   },
//   rarity: "rare",
// };
//
