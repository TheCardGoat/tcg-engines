// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import {
//   DuckburgFunsosFunzone,
//   RakshaFearlessMother,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Raksha - Fearless Mother", () => {
//   It("ON PATROL Once during your turn, you may pay 1 less to move this character to a location.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: duckburgFunsosFunzone.moveCost - 1,
//       Play: [rakshaFearlessMother, duckburgFunsosFunzone],
//     });
//
//     Await testEngine.moveToLocation({
//       Character: rakshaFearlessMother,
//       Location: duckburgFunsosFunzone,
//     });
//   });
// });
//
