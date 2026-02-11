// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const fixitFelixJrNicelandSteward: LorcanitoCharacterCard = {
//   Id: "vqf",
//   Name: "Fix‐It Felix, Jr.",
//   Title: "Niceland Steward",
//   Characteristics: ["hero", "floodborn"],
//   Text: "**Shift 3** _(You may pay 3 {I} to play this on top of one of your characters named Fix-It Felix, Jr.)_ \n**BUILDING TOGETHER** Your locations get +2 {W}.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(3, "Fix-It Felix, Jr."),
//     {
//       Type: "static",
//       Ability: "effects",
//       Name: "BUILDING TOGETHER",
//       Text: "Your locations get +2 {W}.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "willpower",
//           Amount: 2,
//           Modifier: "add",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "location" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Jidao Moara",
//   Number: 12,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 559773,
//   },
//   Rarity: "uncommon",
// };
//
