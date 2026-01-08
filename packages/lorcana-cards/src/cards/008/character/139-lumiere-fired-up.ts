// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacterGetsLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const lumiereFiredUp: LorcanitoCharacterCard = {
//   id: "goi",
//   name: "Lumiere",
//   title: "Fired Up",
//   characteristics: ["floodborn", "ally"],
//   text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lumiere.)\nEvasive (Only characters with Evasive can challenge this character.)\nSACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Lumiere"),
//     evasiveAbility,
//     {
//       type: "static-triggered",
//       name: "SACREBLEU!",
//       text: "Whenever one of your items is banished, this character gets +1 {L} this turn.",
//       trigger: {
//         on: "banish",
//         filters: [
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       layer: {
//         type: "resolution",
//         name: "SACREBLEU!",
//         effects: [thisCharacterGetsLore(1)],
//       },
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby", "sapphire"],
//   cost: 5,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Justin Runfola",
//   number: 139,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631689,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
