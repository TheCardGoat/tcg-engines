// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const donaldDuckSleepwalker: LorcanitoCharacterCard = {
//   Id: "kjq",
//   Reprints: ["w9x"],
//
//   Name: "Donald Duck",
//   Title: "Sleepwalker",
//   Characteristics: ["storyborn"],
//   Text: "**STARTLED AWAKE** Whenever you play an action, this character gets +2 {S} this turn.",
//   Type: "character",
//   Abilities: [
//     WheneverPlays({
//       Name: "Startled Awake",
//       Text: "Whenever you play an action, this character gets +2 {S} this turn.",
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "add",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "Heading toward a rude awekening!",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Strength: 0,
//   Cost: 3,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Leonardo Giammichele",
//   Number: 78,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 527194,
//   },
//   Rarity: "common",
// };
//
