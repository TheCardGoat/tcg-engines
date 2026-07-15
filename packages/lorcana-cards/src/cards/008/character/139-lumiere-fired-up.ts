// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   EvasiveAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { thisCharacterGetsLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const lumiereFiredUp: LorcanitoCharacterCard = {
//   Id: "goi",
//   Name: "Lumiere",
//   Title: "Fired Up",
//   Characteristics: ["floodborn", "ally"],
//   Text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lumiere.)\nEvasive (Only characters with Evasive can challenge this character.)\nSACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(3, "Lumiere"),
//     EvasiveAbility,
//     {
//       Type: "static-triggered",
//       Name: "SACREBLEU!",
//       Text: "Whenever one of your items is banished, this character gets +1 {L} this turn.",
//       Trigger: {
//         On: "banish",
//         Filters: [
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       Layer: {
//         Type: "resolution",
//         Name: "SACREBLEU!",
//         Effects: [thisCharacterGetsLore(1)],
//       },
//     },
//   ],
//   Inkwell: true,
//   Colors: ["ruby", "sapphire"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 3,
//   Illustrator: "Justin Runfola",
//   Number: 139,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631689,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
