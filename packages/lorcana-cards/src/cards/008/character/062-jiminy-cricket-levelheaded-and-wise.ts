// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   targetCharacterGains,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jiminyCricketLevelheadedAndWise: LorcanitoCharacterCard = {
//   id: "rhn",
//   name: "Jiminy Cricket",
//   title: "Level-Headed and Wise",
//   characteristics: ["storyborn", "mentor"],
//   text: "Evasive\nENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     targetCharacterGains({
//       name: "ENOUGH'S ENOUGH",
//       text: "While this character is exerted, opposing characters with Rush enter play exerted.",
//       conditions: [
//         {
//           type: "exerted",
//         },
//       ],
//       gainedAbility: entersPlayExerted({
//         name: "ENOUGH'S ENOUGH",
//       }),
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "opponent" },
//           { filter: "ability", value: "rush" },
//           { filter: "zone", value: ["hand", "play"] },
//         ],
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   illustrator: "Rosa la Barbera / Livio Cacciatore",
//   number: 62,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631392,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
