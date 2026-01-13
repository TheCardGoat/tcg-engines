// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import {
//   duckburgFunsosFunzone,
//   rakshaFearlessMother,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Raksha - Fearless Mother", () => {
//   it("ON PATROL Once during your turn, you may pay 1 less to move this character to a location.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: duckburgFunsosFunzone.moveCost - 1,
//       play: [rakshaFearlessMother, duckburgFunsosFunzone],
//     });
//
//     await testEngine.moveToLocation({
//       character: rakshaFearlessMother,
//       location: duckburgFunsosFunzone,
//     });
//   });
// });
//
