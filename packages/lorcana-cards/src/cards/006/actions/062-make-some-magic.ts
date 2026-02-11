// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenCharacter,
//   ChosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import {
//   DrawACard,
//   MoveDamageEffect,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const makeSomeMagic: LorcanitoActionCard = {
//   Id: "nle",
//   MissingTestCase: true,
//   Name: "Making Magic",
//   Characteristics: ["action"],
//   Text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//
//       ResolveEffectsIndividually: true,
//       Effects: [
//         MoveDamageEffect({
//           Amount: 1,
//           From: chosenCharacter,
//           To: chosenOpposingCharacter,
//         }),
//         DrawACard,
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 3,
//   Illustrator: "Mario Oscar Gabriele",
//   Number: 62,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 593024,
//   },
//   Rarity: "common",
// };
//
