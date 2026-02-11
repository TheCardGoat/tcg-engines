// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const tweedleDeeAndTweedleDumStrangeStorytellers: LorcanitoCharacterCard =
//   {
//     Id: "fkm",
//     Name: "Tweedle Dee & Tweedle Dum",
//     Title: "Strange Storytellers",
//     Characteristics: ["storyborn"],
//     Text: "ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.",
//     Type: "character",
//     Abilities: [
//       WheneverQuests({
//         Name: "ANOTHER RECITATION",
//         Text: "Whenever this character quests, you may return chosen damaged character to their player's hand.",
//         Optional: true,
//         Effects: [
//           {
//             Type: "move",
//             To: "hand",
//             Target: {
//               Type: "card",
//               Value: 1,
//               Filters: [
//                 { filter: "type", value: "character" },
//                 { filter: "zone", value: "play" },
//                 { filter: "status", value: "damaged" },
//               ],
//             },
//           },
//         ],
//       }),
//     ],
//     Inkwell: true,
//     // @ts-expect-error
//     Color: "",
//     Colors: ["emerald", "ruby"],
//     Cost: 5,
//     Strength: 4,
//     Willpower: 4,
//     Illustrator: "Alice Pisoni",
//     Number: 103,
//     Set: "007",
//     ExternalIds: {
//       TcgPlayer: 619461,
//     },
//     Rarity: "uncommon",
//     Lore: 2,
//   };
//
