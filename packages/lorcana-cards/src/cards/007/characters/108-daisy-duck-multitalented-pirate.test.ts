// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnastasiaBossyStepsister,
//   DaisyDuckMultitalentedPirate,
//   JohnSilverVengefulPirate,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Daisy Duck - Multitalented Pirate", () => {
//   It("FOWL PLAY Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [daisyDuckMultitalentedPirate],
//         Hand: [johnSilverVengefulPirate],
//       },
//       {
//         Play: [anastasiaBossyStepsister],
//       },
//     );
//
//     Await testEngine.putIntoInkwell(johnSilverVengefulPirate);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({
//       Targets: [anastasiaBossyStepsister],
//     });
//
//     Expect(testEngine.getCardModel(anastasiaBossyStepsister).zone).toBe("hand");
//   });
// });
//
