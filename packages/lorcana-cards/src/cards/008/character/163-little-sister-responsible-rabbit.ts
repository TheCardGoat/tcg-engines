// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { healEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const littleSisterResponsibleRabbit: LorcanitoCharacterCard = {
//   Id: "sud",
//   Name: "Little Sister",
//   Title: "Responsible Rabbit",
//   Characteristics: ["storyborn", "ally"],
//   Text: "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "LET ME HELP",
//       Text: "When you play this character, you may remove up to 1 damage from chosen character.",
//       Optional: true,
//       Effects: [
//         HealEffect(
//           1,
//           {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//           Undefined,
//           True,
//         ),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 1,
//   Strength: 1,
//   Willpower: 2,
//   Illustrator: "Andrea Parisi",
//   Number: 163,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631460,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
