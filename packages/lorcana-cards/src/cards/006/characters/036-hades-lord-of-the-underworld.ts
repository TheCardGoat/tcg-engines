// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const hadesLordOfTheUnderworld: LorcanitoCharacterCard = {
//   Id: "dme",
//   MissingTestCase: true,
//   Name: "Hades",
//   Title: "Lord of the Dead",
//   Characteristics: ["storyborn", "villain", "deity"],
//   Text: "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
//   Type: "character",
//   Abilities: [
//     WhenYourOtherCharactersIsBanished({
//       Name: "Soul Collector",
//       Text: "Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
//       Conditions: [{ type: "during-turn", value: "opponent" }],
//       Effects: [
//         {
//           Type: "lore",
//           Modifier: "add",
//           Amount: 2,
//           Target: self,
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amethyst"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 3,
//   Illustrator: "Denny Minonne",
//   Number: 36,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 593009,
//   },
//   Rarity: "rare",
// };
//
