import type { ActionCard } from "@tcg/lorcana-types";

export const theMostDiabolicalScheme: ActionCard = {
  id: "hlj",
  cardType: "action",
  name: "The Most Diabolical Scheme",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Banish chosen Villain of yours to banish chosen character.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 131,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3f6d21f1b5fcecdb1b1f40696d7d1016f0e483ba",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenVillainOfYours: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "owner", value: "self" },
//     { filter: "characteristics", value: ["villain"] },
//   ],
// };
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
// export const theMostDiabolicalScheme: LorcanitoActionCard = {
//   id: "qad",
//   name: "The Most Diabolical Scheme",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\nBanish chosen Villain of yours to banish chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "banish",
//           target: chosenVillainOfYours,
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: thisCharacter,
//               effects: [
//                 {
//                   type: "banish",
//                   target: chosenCharacter,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   flavour: "New comes the real tour de force \nTricky and wicked, of course",
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Carlos Ruiz",
//   number: 131,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527540,
//   },
//   rarity: "uncommon",
// };
//
