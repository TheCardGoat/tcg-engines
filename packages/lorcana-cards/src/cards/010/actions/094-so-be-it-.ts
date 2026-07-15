// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenItem,
//   EachOfYourCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const soBeIt: LorcanitoActionCard = {
//   Id: "o2o",
//   Name: "So Be It!",
//   Characteristics: ["action"],
//   Text: "Each of your characters gets +1 {S} this turn. You may banish chosen item.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Illustrator: "Valentina Graziuso",
//   Number: 94,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 658462,
//   },
//   Rarity: "common",
//   Abilities: [
//     {
//       Type: "resolution",
//       Text: "Each of your characters gets +1 this turn. You may banish chosen item.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Modifier: "add",
//           Amount: 1,
//           Duration: "turn",
//           Target: eachOfYourCharacters,
//         },
//         {
//           Type: "banish",
//           Target: chosenItem,
//         },
//       ],
//     },
//   ],
// };
//
