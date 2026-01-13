// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// const chosenCharacter = {
//   type: "card" as const,
//   value: 1,
//   filters: [
//     { filter: "zone" as const, value: "play" as const },
//     { filter: "type" as const, value: "character" as const },
//   ],
// };
// const self = {
//   type: "player" as const,
//   value: "self" as const,
// };
//
// export const improvise: LorcanitoActionCard = {
//   id: "m0h",
//   reprints: ["tdy"],
//
//   name: "Improvise",
//   characteristics: ["action"],
//   text: "Chosen character gets +1 {S} this turn. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Chosen character gets +1 {S} this turn. Draw a card.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//         {
//           type: "draw",
//           amount: 1,
//           target: self,
//         },
//       ],
//     },
//   ],
//   flavour: "Shan-Yu: It looks like you're out of ideas. \nMulan: Not quite!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Mane Kandalyan",
//   number: 99,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 520863,
//   },
//   rarity: "common",
// };
//
