// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const brutusFearsomeCrocodile: LorcanitoCharacterCard = {
//   id: "xuo",
//   name: "Brutus",
//   title: "Fearsome Crocodile",
//   characteristics: ["storyborn", "ally"],
//   text: "SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "SPITEFUL",
//       text: "During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//         {
//           type: "this-turn",
//           value: "was-damaged",
//           target: "self",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//           ],
//         },
//       ],
//       effects: [youGainLore(2)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Teresita OJ / SOG",
//   number: 125,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 633431,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
