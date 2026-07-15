// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const gadgetHackwrenchQuirkyScientist: LorcanitoCharacterCard = {
//   Id: "i8y",
//   Name: "Gadget Hackwrench",
//   Title: "Quirky Scientist",
//   Characteristics: ["storyborn", "ally", "inventor"],
//   Text: "GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "GOLLY!",
//       Text: "When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
//       Optional: true,
//       ResolutionConditions: [
//         {
//           Type: "filter",
//           Filters: [
//             { filter: "owner", value: "opponent" },
//             { filter: "zone", value: "hand" },
//           ],
//           Comparison: {
//             Operator: "gt",
//             Value: {
//               Dynamic: true,
//               Filters: [
//                 { filter: "owner", value: "self" },
//                 { filter: "zone", value: "hand" },
//               ],
//             },
//           },
//         },
//       ],
//       Effects: [drawACard],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 2,
//   Illustrator: "Lisanne Koetsier",
//   Number: 99,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631412,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
