import type { ActionCard } from "@tcg/lorcana-types";

export const ringTheBell: ActionCard = {
  id: "eam",
  cardType: "action",
  name: "Ring the Bell",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Banish chosen damaged character.",
  cost: 3,
  cardNumber: 101,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "33859d5b1f672f1eb04078991404e42b82ae7f43",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenDamagedCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     {
//       filter: "status",
//       value: "damage",
//       comparison: { operator: "gte", value: 1 },
//     },
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// export const ringTheBell: LorcanitoActionCard = {
//   id: "bvn",
//
//   name: "Ring The Bell",
//   characteristics: ["action"],
//   text: "Banish chosen damaged character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "banish",
//           target: chosenDamagedCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "I'm afraid that you've gone and upset me. \n– Ratigan",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Brian Weisz",
//   number: 101,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525266,
//   },
//   rarity: "uncommon",
// };
//
