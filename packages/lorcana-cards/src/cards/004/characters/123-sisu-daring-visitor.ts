// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const sisuDaringVisitor: LorcanitoCharacterCard = {
//   id: "npe",
//   reprints: ["eyu"],
//   missingTestCase: true,
//   name: "Sisu",
//   title: "Daring Visitor",
//   characteristics: ["hero", "storyborn", "dragon", "deity"],
//   text: "**Evasive**\n\n\n**BRING ON THE HEAT!** When you play this character, banish chosen opposing character with 1 {S} or less.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     whenYouPlayThis({
//       name: "Bring on the heat!",
//       text: "When you play this character, banish chosen opposing character with 1 {S} or less.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "opponent" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "lte", value: 1 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Come on - what's the worst that can happen?",
//   colors: ["ruby"],
//   cost: 3,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Otto Paredes",
//   number: 123,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550600,
//   },
//   rarity: "uncommon",
// };
//
