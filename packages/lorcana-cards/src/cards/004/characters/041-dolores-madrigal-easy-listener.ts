// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const doloresMadrigalEasyListener: LorcanitoCharacterCard = {
//   id: "ytb",
//   reprints: ["yvi"],
//   missingTestCase: true,
//   name: "Dolores Madrigal",
//   title: "Easy Listener",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: "**MAGICAL INFORMANT** When you play this character, if an opponent has an exerted character in play, you may draw a card.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "**MAGICAL INFORMANT**",
//       text: "When you play this character, if an opponent has an exerted character in play, you may draw a card.",
//       resolutionConditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "opponent" },
//             {
//               filter: "status",
//               value: "exerted",
//             },
//           ],
//         },
//       ],
//       optional: true,
//       effects: [drawACard],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Otto Perdes",
//   number: 41,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543900,
//   },
//   rarity: "common",
// };
//
