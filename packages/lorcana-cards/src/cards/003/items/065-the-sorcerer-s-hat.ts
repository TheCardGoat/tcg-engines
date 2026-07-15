// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import {
//   AnyCard,
//   NamedCard,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const theSorcerersHat: LorcanitoItemCard = {
//   Id: "h9u",
//   Name: "The Sorcerer's Hat",
//   Characteristics: ["item"],
//   Text: "**INCREDIBLE ENERGY** {E}, 1 {I} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Incredible Energy",
//       Text: "{E}, 1 {I} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       NameACard: true,
//       Effects: [
//         {
//           Type: "reveal-top-card",
//           Target: namedCard,
//           OnTargetMatchEffects: [
//             {
//               Type: "move",
//               To: "hand",
//               Target: anyCard,
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   Flavour:
//     "Minnie approached it cautiously. Whoever had placed it here might have prepared traps.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 2,
//   Illustrator: "Jiahui Eva Gao",
//   Number: 65,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 532639,
//   },
//   Rarity: "rare",
// };
//
