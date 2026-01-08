// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const sisuEmboldenedWarrior: LorcanitoCharacterCard = {
//   id: "m8s",
//   reprints: ["g9x"],
//   name: "Sisu",
//   title: "Emboldened Warrior",
//   characteristics: ["hero", "storyborn", "dragon", "deity"],
//   text: "**SURGE OF POWER** This character gets +1 {S} for each card in opponent's hands.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "SURGE OF POWER",
//       text: "This character gets +1 {S} for each card in opponent's hands.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Sometimes the only way to fight the unimaginable is with the incredible.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "LadyShalirin",
//   number: 124,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547778,
//   },
//   rarity: "rare",
// };
//
