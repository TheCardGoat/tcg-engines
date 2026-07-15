// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { EffectStaticAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Const objectionableStateAbility: EffectStaticAbility = {
//   Name: "OBJECTIONABLE STATE",
//   Text: "Damaged characters can't challenge your characters.",
//   Type: "static",
//   Ability: "effects",
//   Effects: [
//     {
//       Type: "restriction",
//       Restriction: "challenge-characters",
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "opponent" },
//           { filter: "status", value: "damaged" },
//         ],
//       },
//     },
//   ],
// };
//
// Export const kingOfHeartsPickyRuler: LorcanitoCharacterCard = {
//   Id: "qim",
//   Name: "King Of Hearts",
//   Title: "Picky Ruler",
//   Characteristics: ["storyborn", "ally", "king"],
//   Text: "OBJECTIONABLE STATE Damaged characters can't challenge your characters.",
//   Type: "character",
//   Abilities: [objectionableStateAbility],
//   Inkwell: false,
//   Colors: ["emerald"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Isiah Mesq",
//   Number: 111,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 618705,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
