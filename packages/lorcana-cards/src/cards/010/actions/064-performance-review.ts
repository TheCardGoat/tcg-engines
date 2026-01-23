import type { ActionCard } from "@tcg/lorcana-types";

export const performanceReview: ActionCard = {
  id: "dcb",
  cardType: "action",
  name: "Performance Review",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "010",
  text: "{E} chosen ready character of yours to draw cards equal to that character’s {L}.",
  cost: 2,
  cardNumber: 64,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3015d5bd300363ca09ccc63ea064479c8c7942a4",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { exertChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// const chosenReadyCharacterOfYours: CardEffectTarget = {
//   type: "card" as const,
//   value: 1,
//   filters: [
//     { filter: "type" as const, value: "character" as const },
//     { filter: "zone" as const, value: "play" as const },
//     { filter: "owner" as const, value: "self" as const },
//     { filter: "status" as const, value: "ready" as const },
//   ],
// };
//
// export const performanceReview: LorcanitoActionCard = {
//   id: "rok",
//   name: "Performance Review",
//   characteristics: ["action"],
//   text: "chosen ready character of yours to draw cards equal to that character's {L}.",
//   type: "action",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Patri Balanovsky",
//   number: 64,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660367,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Performance Review",
//       text: "chosen ready character of yours to draw cards equal to that character's {L}.",
//       effects: [
//         {
//           type: "create-layer-based-on-target",
//           target: chosenReadyCharacterOfYours,
//           resolveAmountBeforeCreatingLayer: true,
//           effects: [
//             exertChosenCharacter,
//             {
//               type: "draw",
//               amount: {
//                 dynamic: true,
//                 target: { attribute: "lore" },
//               },
//               target: self,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
