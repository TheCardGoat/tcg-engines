import type { ActionCard } from "@tcg/lorcana-types";

export const bounce: ActionCard = {
  id: "1fq",
  cardType: "action",
  name: "Bounce",
  inkType: ["emerald"],
  franchise: "Winnie the Pooh",
  set: "002",
  text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
  cost: 2,
  cardNumber: 97,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b85b9b0d27f8d3a0741d01cb289b25aab4f498e3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// const chosenCharacterOfYour = {
//   type: "card" as const,
//   value: 1,
//   filters: [
//     { filter: "zone" as const, value: "play" as const },
//     { filter: "type" as const, value: "character" as const },
//     { filter: "owner" as const, value: "self" as const },
//   ],
// };
// const chosenCharacter = {
//   type: "card" as const,
//   value: 1,
//   filters: [
//     { filter: "zone" as const, value: "play" as const },
//     { filter: "type" as const, value: "character" as const },
//   ],
// };
//
// export const bounce: LorcanitoActionCard = {
//   id: "fpf",
//   name: "Bounce",
//   characteristics: ["action"],
//   text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
//       optional: false,
//       resolveEffectsIndividually: true,
//       dependentEffects: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacterOfYour,
//         },
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Are you ready for some bouncing?\n−Tigger",
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Bill Robinson",
//   number: 97,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 517599,
//   },
//   rarity: "uncommon",
// };
//
