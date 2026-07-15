// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const annaTrustingSister: LorcanitoCharacterCard = {
//   Id: "uws",
//   Name: "Anna",
//   Title: "Trusting Sister",
//   Characteristics: ["storyborn", "hero", "queen"],
//   Text: "WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharacter({
//       Name: "WE CAN DO THIS TOGETHER",
//       Text: "When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
//       Conditions: [ifYouHaveCharacterNamed("Elsa")],
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "inkwell",
//           Amount: 1,
//           Exerted: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               {
//                 Filter: "top-deck",
//                 Value: "self",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 2,
//   Illustrator: "Samanta Erdini",
//   Number: 157,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631455,
//   },
//   Rarity: "common",
//   Lore: 2,
// };
//
