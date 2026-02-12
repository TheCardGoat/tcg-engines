// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const hansNobleScoundrel: LorcanitoCharacterCard = {
//   Id: "zqc",
//   Reprints: ["e93"],
//   MissingTestCase: true,
//   Name: "Hans",
//   Title: "Noble Scoundrel",
//   Characteristics: ["storyborn", "villain", "prince"],
//   Text: "**ROYAL SCHEMES** When you play this characer, if a Princess or Queen character is in play, gain 1 lore.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Royal Schemes",
//       Text: "When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
//       ResolutionConditions: [
//         {
//           Type: "filter",
//           Comparison: { operator: "gte", value: 1 },
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             {
//               Filter: "characteristics",
//               Conjunction: "or",
//               Value: ["princess", "queen"],
//             },
//           ],
//         },
//       ],
//       Effects: [youGainLore(1)],
//     },
//   ],
//   Flavour:
//     "Hans was confident he could bring Anna to Ursula — all he needed was something of Kristoff's to lure her in.",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 2,
//   Lore: 2,
//   Illustrator: "Dustin Panzino / Leonardo Giammichele",
//   Number: 146,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 543914,
//   },
//   Rarity: "common",
// };
//
