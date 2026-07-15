// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   BodyguardAbility,
//   ShiftAbility,
//   SupportAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mickeyMouseMusketeerCaptain: LorcanitoCharacterCard = {
//   Id: "pjf",
//   MissingTestCase: true,
//   Name: "Mickey Mouse",
//   Title: "Musketeer Captain",
//   Characteristics: ["hero", "floodborn", "captain", "musketeer"],
//   Text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)_\n\n**Bodyguard**, **Support**\n\n\n**MUSKETEERS UNITED** When you play this character, if you used **Shift** to play him, you may draw a chard for each character with **Bodyguard** you have in play.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(5, "mickey mouse"),
//     BodyguardAbility,
//     SupportAbility,
//     {
//       Type: "resolution",
//       ResolutionConditions: [{ type: "resolution", value: "shift" }],
//       Name: "Musketeers United",
//       Text: "When you play this character, if you used **Shift** to play him, you may draw a chard for each character with **Bodyguard** you have in play.",
//       Effects: [
//         DrawXCards({
//           Dynamic: true,
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "ability", value: "bodyguard" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//         }),
//       ],
//     },
//   ],
//   Colors: ["amber"],
//   Cost: 7,
//   Strength: 3,
//   Willpower: 6,
//   Lore: 2,
//   Illustrator: "Jochem van Gool",
//   Number: 16,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549534,
//   },
//   Rarity: "legendary",
// };
//
