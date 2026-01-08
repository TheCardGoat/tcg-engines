import type { ActionCard } from "@tcg/lorcana-types";

export const teethAndAmbitions: ActionCard = {
  id: "c3r",
  cardType: "action",
  name: "Teeth and Ambitions",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "002",
  text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 130,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2ba03555a3279d07af241b0111de37b386da6424",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacterOfYour: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "owner", value: "self" },
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
// export const teethAndAmbitions: LorcanitoActionCard = {
//   id: "dvr",
//
//   name: "Teeth and Ambitions",
//   characteristics: ["action", "song"],
//   text: "_A character with cost 2 or more can {E} to sing this song for free.)_\n\nDeal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacterOfYour,
//         },
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Of course, quid pro quo, you're expected \nTo take certain duties on board",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Jake Parker",
//   number: 130,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527248,
//   },
//   rarity: "rare",
// };
//
