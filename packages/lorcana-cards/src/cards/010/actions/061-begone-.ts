// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacterItemOrLocationWithCost3OrLess: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: ["character", "item", "location"] },
//     { filter: "zone", value: "play" },
//     {
//       filter: "attribute",
//       value: "cost",
//       comparison: { operator: "lte", value: 3 },
//     },
//   ],
// };
//
// export const begone: LorcanitoActionCard = {
//   id: "r2b",
//   name: "Begone!",
//   characteristics: ["action"],
//   text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
//   type: "action",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Agathe Molin",
//   number: 61,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659420,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Begone!",
//       text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacterItemOrLocationWithCost3OrLess,
//         },
//       ],
//     },
//   ],
// };
//
