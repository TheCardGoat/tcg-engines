// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
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
// export const strengthOfARagingFire: LorcanitoActionCard = {
//   id: "x5y",
//   reprints: ["fua"],
//   name: "Strength of a Raging Fire",
//   characteristics: ["action", "song"],
//   text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nDeal damage to chosen character equal to the number of characters you have in play.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Strength of a Raging Fire",
//       text: "Deal damage to chosen character equal to the number of characters you have in play.",
//       effects: [
//         {
//           type: "damage",
//           target: chosenCharacter,
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Tranquil as a forest \nBut on fire within",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Jared Nickerl / Alex Accorsi",
//   number: 201,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527238,
//   },
//   rarity: "rare",
// };
//
