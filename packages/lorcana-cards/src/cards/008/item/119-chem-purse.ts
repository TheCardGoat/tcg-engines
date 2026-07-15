// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { wheneverYouPlayACharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const chemPurse: LorcanitoItemCard = {
//   Id: "xcs",
//   Name: "Chem Purse",
//   Characteristics: ["item"],
//   Text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
//   Type: "item",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Illustrator: "Jared Nickel",
//   Number: 119,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631428,
//   },
//   Rarity: "common",
//   Abilities: [
//     WheneverYouPlayACharacter({
//       Name: "HERE'S THE BEST PART",
//       Text: "Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
//       HasShifted: true,
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 4,
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "source", value: "trigger" }],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
