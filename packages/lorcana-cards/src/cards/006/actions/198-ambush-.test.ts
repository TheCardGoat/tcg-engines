// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   Ambush,
//   MammaOdieLoneSage,
//   OwlPirateLookout,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ambush!", () => {
//   It("{E} one of your characters to deal damage equal to their {S} to chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ambush.cost,
//         Play: [owlPirateLookout],
//         Hand: [ambush],
//       },
//       {
//         Play: [mammaOdieLoneSage],
//       },
//     );
//
//     Await testEngine.playCard(ambush);
//
//     Await testEngine.resolveTopOfStack({ targets: [owlPirateLookout] }, true);
//     Expect(testEngine.getCardModel(owlPirateLookout).exerted).toBe(true);
//
//     Await testEngine.resolveTopOfStack({ targets: [mammaOdieLoneSage] });
//     Expect(testEngine.getCardModel(mammaOdieLoneSage).damage).toBe(
//       OwlPirateLookout.strength,
//     );
//   });
//
//   Describe("Regression", () => {
//     It.skip("Should not target Wet Characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: ambush.cost + owlPirateLookout.cost,
//           Hand: [ambush, owlPirateLookout],
//         },
//         {
//           Play: [mammaOdieLoneSage],
//         },
//       );
//
//       Await testEngine.playCard(owlPirateLookout);
//       Await testEngine.playCard(ambush);
//
//       Await testEngine.resolveTopOfStack({ targets: [owlPirateLookout] }, true);
//       Expect(testEngine.getCardModel(owlPirateLookout).exerted).toBe(false);
//     });
//   });
// });
//
