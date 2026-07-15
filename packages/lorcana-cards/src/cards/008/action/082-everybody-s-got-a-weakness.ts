// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenOpposingCharacter,
//   YourCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import {
//   DrawXCards,
//   MoveDamageEffect,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const everybodysGotAWeakness: LorcanitoActionCard = {
//   Id: "j44",
//   Name: "Everybody's Got A Weakness",
//   Characteristics: ["action"],
//   Text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         MoveDamageEffect({
//           Amount: 1,
//           From: yourCharacters,
//           To: chosenOpposingCharacter,
//         }),
//         DrawXCards({
//           Dynamic: true,
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             { filter: "status", value: "damaged" },
//           ],
//         }),
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Illustrator: "Linh Dang",
//   Number: 82,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631832,
//   },
//   Rarity: "rare",
// };
//
