// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { ifYouHaveACardInYourDiscardNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const yzmaOnEdge: LorcanitoCharacterCard = {
//   Id: "q93",
//   Name: "Yzma",
//   Title: "On Edge",
//   Characteristics: ["storyborn", "villain", "sorcerer"],
//   Text: "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "WHY DO WE EVEN HAVE THAT LEVER?",
//       Text: "When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
//       Optional: true,
//       Conditions: [ifYouHaveACardInYourDiscardNamed("Pull the Lever!")],
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "shuffle-deck",
//           Target: self,
//         },
//         {
//           Type: "move",
//           To: "hand",
//           IsPrivate: false,
//           ShouldRevealMoved: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "deck" },
//               { filter: "owner", value: "self" },
//               {
//                 Filter: "attribute",
//                 Value: "name",
//                 Comparison: {
//                   Operator: "eq",
//                   Value: "Wrong Lever!",
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amethyst", "emerald"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 6,
//   Illustrator: "Julien Yvardis",
//   Number: 68,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631681,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
