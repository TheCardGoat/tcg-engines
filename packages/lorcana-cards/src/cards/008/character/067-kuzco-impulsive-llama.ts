// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const kuzcoImpulsiveLlama: LorcanitoCharacterCard = {
//   Id: "fo7",
//   Name: "Kuzco",
//   Title: "Impulsive Llama",
//   Characteristics: ["floodborn", "king"],
//   Text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Kuzco.)\nWHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(4, "Kuzco"),
//     WhenYouPlayThisCharacter({
//       Name: "WHAT DOES THIS DO?",
//       Text: "When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
//       Responder: "opponent",
//       Effects: [
//         {
//           Type: "move",
//           To: "deck",
//           Bottom: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         DrawACard,
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amethyst", "emerald"],
//   Cost: 7,
//   Strength: 5,
//   Willpower: 5,
//   Illustrator: "Kendall Hale",
//   Number: 67,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631395,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
