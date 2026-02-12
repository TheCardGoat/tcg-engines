// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const merlinBackFromTheBermudas: LorcanitoCharacterCard = {
//   Id: "tbu",
//   Name: "Merlin",
//   Title: "Back from Bermuda",
//   Characteristics: ["sorcerer", "storyborn", "mentor"],
//   Text: "**LONG LIVE THE KING!** Your Arthur characters gain **Resist** +1 _(Damage dealt to this character is reduced by 1)_",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "LONG LIVE THE KING!",
//       Text: "Your Arthur characters gain **Resist** +1 _(Damage dealt to this character is reduced by 1)_",
//       GainedAbility: resistAbility(1),
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//           {
//             Filter: "attribute",
//             Value: "name",
//             Comparison: { operator: "eq", value: "Arthur" },
//           },
//         ],
//       },
//     },
//   ],
//   Flavour: "A little rest and relaxation will do your health good, boy.",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 1,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Alice Pisoni",
//   Number: 142,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 561966,
//   },
//   Rarity: "common",
// };
//
