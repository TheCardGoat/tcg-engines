// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { mayBanish } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const getOut: LorcanitoActionCard = {
//   Id: "vaq",
//   Name: "Get Out!",
//   Characteristics: ["action"],
//   Text: "Banish chosen character, then return an item card from your discard to your hand.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         MayBanish(chosenCharacter),
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "item" },
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Inkwell: false,
//   Colors: ["ruby", "sapphire"],
//   Cost: 6,
//   Illustrator: "Diego Saito",
//   Number: 148,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631448,
//   },
//   Rarity: "uncommon",
// };
//
