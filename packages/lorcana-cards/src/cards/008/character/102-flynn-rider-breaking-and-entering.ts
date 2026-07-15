// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import {
//   DiscardACard,
//   YourOpponentGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const flynnRiderBreakingAndEntering: LorcanitoCharacterCard = {
//   Id: "v6l",
//   Name: "Flynn Rider",
//   Title: "Breaking and Entering",
//   Characteristics: ["storyborn", "hero", "prince"],
//   Text: "THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
//   Type: "character",
//   Inkwell: false,
//   Colors: ["emerald"],
//   Cost: 4,
//   Strength: 1,
//   Willpower: 4,
//   Illustrator: "Koni",
//   Number: 102,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631415,
//   },
//   Rarity: "super_rare",
//   Lore: 3,
//   Abilities: [
//     WhenChallenged({
//       Name: "THIS IS A VERY BIG DAY",
//       Text: "Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
//       Responder: "opponent",
//       Conditions: [
//         {
//           Type: "filter",
//           Filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "opponent" },
//           ],
//           Comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       Effects: [
//         {
//           Type: "modal",
//           // TODO: Get rid of target
//           Target: chosenCharacter,
//           Modes: [
//             {
//               Id: "1",
//               Text: "You discard a card.",
//               Effects: [discardACard],
//               Responder: "opponent",
//             },
//             {
//               Id: "2",
//               Text: "Your opponent gains 2 lore.",
//               Effects: [yourOpponentGainLore(2)],
//               Responder: "opponent",
//             },
//           ],
//         },
//       ],
//     }),
//   ],
// };
//
