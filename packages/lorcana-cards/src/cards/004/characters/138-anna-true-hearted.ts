// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const annaTrueHearted: LorcanitoCharacterCard = {
//   Id: "lok",
//   Reprints: ["p5i"],
//   MissingTestCase: true,
//   Name: "Anna",
//   Title: "True-Hearted",
//   Characteristics: ["hero", "dreamborn", "queen", "knight"],
//   Text: "**LET ME HELP YOU** Whenever this character quests, your other Hero characters get +1 {L} this turn.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Name: "Let me help you",
//       Text: "Whenever this character quests, your other Hero characters get +1 {L} this turn.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "lore",
//           Amount: 1,
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: "all",
//             ExcludeSelf: true,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["hero"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "Make sure you know what's truly important and be willing to fight for it.",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Leonardo Giammichele",
//   Number: 138,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550517,
//   },
//   Rarity: "super_rare",
// };
//
