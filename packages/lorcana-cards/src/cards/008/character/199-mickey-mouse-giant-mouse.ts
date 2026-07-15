// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mickeyMouseGiantMouse: LorcanitoCharacterCard = {
//   Id: "vyt",
//   Name: "Mickey Mouse",
//   Title: "Giant Mouse",
//   Characteristics: ["dreamborn", "hero"],
//   Text: "Bodyguard\nTHE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
//   Type: "character",
//   Abilities: [
//     BodyguardAbility,
//     WhenThisCharacterBanished({
//       Name: "THE BIGGEST STAR EVER",
//       Text: "When this character is banished, deal 5 damage to each opposing character.",
//       Effects: [
//         DealDamageEffect(5, {
//           Type: "card",
//           Value: "all",
//           Filters: [
//             {
//               Filter: "owner",
//               Value: "opponent",
//             },
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//           ],
//         }),
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 10,
//   Strength: 10,
//   Willpower: 10,
//   Illustrator: "Joy Ang / Giulia Riva",
//   Number: 199,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631331,
//   },
//   Rarity: "legendary",
//   Lore: 5,
// };
//
