// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Const chosenCharacter: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// Export const youCanFly: LorcanitoActionCard = {
//   Id: "yio",
//   Reprints: ["uv6"],
//
//   Name: "You Can Fly",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nChosen character gains **Evasive** until the start of your next turn. _Only characters with Evasive can challenge them.)_",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "evasive",
//           Modifier: "add",
//           Duration: "next_turn",
//           Until: true,
//           Target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 2,
//   Illustrator: "Eva Widermann",
//   Number: 133,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 527243,
//   },
//   Rarity: "uncommon",
// };
//
