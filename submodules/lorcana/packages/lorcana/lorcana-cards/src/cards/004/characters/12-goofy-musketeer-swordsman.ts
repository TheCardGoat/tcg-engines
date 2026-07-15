// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const goofyMusketeerSwordsman: LorcanitoCharacterCard = {
//   Id: "moa",
//   Name: "Goofy",
//   Title: "Musketeer Swordsman",
//   Characteristics: ["hero", "dreamborn", "musketeer"],
//   Text: "**EN GAWRSH!** Whenever you play a character with **Bodyguard**, ready this character. He can't quest for the rest of this turn.",
//   Type: "character",
//   Abilities: [
//     WheneverPlays({
//       Name: "**EN GAWRSH!**",
//       Text: "Whenever you play a character with **Bodyguard**, ready this character. He can't quest for the rest of this turn.",
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "owner", value: "self" },
//           {
//             Filter: "ability",
//             Value: "bodyguard",
//           },
//         ],
//       },
//       Effects: [
//         ...readyAndCantQuest({
//           Type: "card",
//           Value: "all",
//           Filters: [{ filter: "source", value: "self" }],
//         }),
//       ],
//     }),
//   ],
//   Flavour: "Count me in!",
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Carlos Luzzi",
//   Number: 12,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 548549,
//   },
//   Rarity: "rare",
// };
//
