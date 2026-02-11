// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Const chosenCharacter = {
//   Type: "card" as const,
//   Value: 1,
//   Filters: [
//     { filter: "zone" as const, value: "play" as const },
//     { filter: "type" as const, value: "character" as const },
//   ],
// };
// Const self = {
//   Type: "player" as const,
//   Value: "self" as const,
// };
//
// Export const improvise: LorcanitoActionCard = {
//   Id: "m0h",
//   Reprints: ["tdy"],
//
//   Name: "Improvise",
//   Characteristics: ["action"],
//   Text: "Chosen character gets +1 {S} this turn. Draw a card.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Text: "Chosen character gets +1 {S} this turn. Draw a card.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 1,
//           Modifier: "add",
//           Duration: "turn",
//           Target: chosenCharacter,
//         },
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: self,
//         },
//       ],
//     },
//   ],
//   Flavour: "Shan-Yu: It looks like you're out of ideas. \nMulan: Not quite!",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 1,
//   Illustrator: "Mane Kandalyan",
//   Number: 99,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 520863,
//   },
//   Rarity: "common",
// };
//
