// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const princePhillipVanquisherOfFoes: LorcanitoCharacterCard = {
//   id: "dh6",
//   reprints: ["wj7"],
//   missingTestCase: true,
//   name: "Prince Phillip",
//   title: "Vanquisher of Foes",
//   characteristics: ["hero", "floodborn", "prince"],
//   text: "**Shift** 6 \n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**STRIKE TO THE HEART** When you play this character, banish all opposing damaged characters.",
//   type: "character",
//   abilities: [
//     shiftAbility(6, "prince phillip"),
//     evasiveAbility,
//     {
//       type: "resolution",
//       name: "Strike To The Heart",
//       text: "When you play this character, banish all opposing damaged characters.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "opponent" },
//               {
//                 filter: "status",
//                 value: "damaged",
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 9,
//   lore: 3,
//   strength: 6,
//   willpower: 6,
//   illustrator: "Randy Bishop",
//   number: 87,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550581,
//   },
//   rarity: "super_rare",
// };
//
