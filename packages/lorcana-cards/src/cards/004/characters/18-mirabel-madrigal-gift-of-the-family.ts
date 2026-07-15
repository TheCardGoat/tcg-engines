// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const mirabelMadrigalGiftOfTheFamily: LorcanitoCharacterCard = {
//   Id: "o01",
//   MissingTestCase: true,
//   Name: "Mirabel Madrigal",
//   Title: "Gift of the Family",
//   Characteristics: ["hero", "dreamborn", "madrigal"],
//   Text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_\n\n**SAVING THE MIRACLE** Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
//   Type: "character",
//   Abilities: [
//     SupportAbility,
//     WheneverQuests({
//       Name: "Saving The Miracle",
//       Text: "Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "lore",
//           Amount: 1,
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: "all",
//             ExcludeSelf: true,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["madrigal"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Colors: ["amber"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Aubrey Archer",
//   Number: 18,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 543898,
//   },
//   Rarity: "super_rare",
// };
//
