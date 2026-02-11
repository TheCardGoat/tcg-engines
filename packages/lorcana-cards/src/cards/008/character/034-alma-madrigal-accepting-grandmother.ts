// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { wheneverOneOrMoreOfYourCharSingsASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const almaMadrigalAcceptingGrandmother: LorcanitoCharacterCard = {
//   Id: "h1w",
//   Name: "Alma Madrigal",
//   Title: "Accepting Grandmother",
//   Characteristics: ["storyborn", "mentor", "madrigal"],
//   Text: "THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["amber", "amethyst"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 5,
//   Illustrator: "Simone Buonfantino",
//   Number: 34,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631374,
//   },
//   Rarity: "uncommon",
//   Lore: 2,
//   Abilities: [
//     WheneverOneOrMoreOfYourCharSingsASong({
//       Name: "THE MIRACLE IS YOU",
//       Text: "Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
//       OncePerTurn: true,
//       Conditions: [duringYourTurn],
//       Optional: true,
//       Effects: [
//         {
//           Type: "exert",
//           Exert: false,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "sing", value: "singer" }],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
