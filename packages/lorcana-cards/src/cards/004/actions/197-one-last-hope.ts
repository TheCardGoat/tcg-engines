// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   LorcanitoActionCard,
//   TargetConditionalEffect,
// } from "@lorcanito/lorcana-engine";
// Import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const targetHero = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     {
//       Filter: "characteristics",
//       Value: ["hero"],
//     },
//   ],
// };
//
// Export const oneLastHope: LorcanitoActionCard = {
//   Id: "b2r",
//   Reprints: ["i3n"],
//   Name: "One Last Hope",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\n\nChosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "target-conditional",
//           Effects: [
//             {
//               Type: "ability",
//               Ability: "challenge_ready_chars",
//               Modifier: "add",
//               Duration: "turn",
//               Until: true,
//               Target: targetHero,
//             },
//             {
//               Type: "ability",
//               Ability: "resist",
//               Amount: 2,
//               Modifier: "add",
//               Duration: "next_turn",
//               Until: true,
//               Target: targetHero,
//             },
//           ],
//           Fallback: [chosenCharacterGainsResist(2)],
//           // TODO: Re implement conditional target
//           Target: targetHero,
//         } as TargetConditionalEffect,
//       ],
//     },
//   ],
//   Colors: ["steel"],
//   Cost: 3,
//   Illustrator: "Alice Pisoni",
//   Number: 197,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549616,
//   },
//   Rarity: "rare",
// };
//
