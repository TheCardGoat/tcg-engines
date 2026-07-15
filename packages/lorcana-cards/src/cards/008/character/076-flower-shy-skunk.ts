// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// Import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const flowerShySkunk: LorcanitoCharacterCard = {
//   Id: "mka",
//   Name: "Flower",
//   Title: "Shy Skunk",
//   Characteristics: ["storyborn", "ally"],
//   Text: "LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Sandro Rios",
//   Number: 76,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631342,
//   },
//   Rarity: "rare",
//   Lore: 1,
//   Abilities: [
//     WheneverTargetPlays({
//       Name: "LOOKING FOR FRIENDS",
//       Text: "Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//       Optional: true,
//       ExcludeSelf: true,
//       TriggerFilter: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//       ],
//       Effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
//     }),
//   ],
// };
//
