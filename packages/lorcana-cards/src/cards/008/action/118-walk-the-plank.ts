// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Const walkThePlankGainedAbility: ActivatedAbility = {
//   Type: "activated",
//   Costs: [{ type: "exert" }],
//   Effects: [
//     {
//       Type: "banish",
//       Target: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           {
//             Filter: "status",
//             Value: "damage",
//             Comparison: { operator: "gte", value: 1 },
//           },
//         ],
//       },
//     },
//   ],
// };
//
// Const walkThePlankAbility: ResolutionAbility = {
//   Type: "resolution",
//   Effects: [
//     {
//       Type: "ability",
//       Ability: "custom",
//       Duration: "turn",
//       Modifier: "add",
//       CustomAbility: walkThePlankGainedAbility,
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "characteristics", value: ["pirate"] },
//         ],
//       },
//     },
//   ],
// };
//
// Export const walkThePlank: LorcanitoActionCard = {
//   Id: "yl4",
//   Name: "Walk The Plank!",
//   Characteristics: ["action"],
//   Text: 'Your Pirate characters gain "{E} – Banish chosen damaged character" this turn.',
//   Type: "action",
//   Inkwell: false,
//   Colors: ["emerald", "steel"],
//   Cost: 3,
//   Illustrator: "Alberto Zermeno",
//   Number: 118,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631427,
//   },
//   Rarity: "uncommon",
//   Abilities: [walkThePlankAbility],
// };
//
