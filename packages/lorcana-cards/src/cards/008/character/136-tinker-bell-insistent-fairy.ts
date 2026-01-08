// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self, targetCard } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const tinkerBellInsistentFairy: LorcanitoCharacterCard = {
//   id: "pi7",
//   name: "Tinker Bell",
//   title: "Insistent Fairy",
//   characteristics: ["storyborn", "ally", "fairy"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)\nPAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "PAY ATTENTION",
//       text: "Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "attribute",
//             value: "strength",
//             comparison: { operator: "gte", value: 5 },
//           },
//         ],
//       },
//       optional: true,
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "source", value: "trigger" },
//               { filter: "status", value: "ready" },
//             ],
//           },
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: targetCard,
//               filters: targetCard.filters,
//               effects: [
//                 {
//                   type: "lore",
//                   modifier: "add",
//                   amount: 2,
//                   target: self,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//     evasiveAbility,
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   illustrator: "Amber Kommanvongsa",
//   number: 136,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631842,
//   },
//   rarity: "legendary",
//   lore: 1,
// };
//
