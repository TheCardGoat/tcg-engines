// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { voyage } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import {
//   vanellopeVonSchweetzSugarRushChamp,
//   vanellopeVonSchweetzSugarRushPrincess,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { sugarRushSpeedwayFinishLine } from "@lorcanito/lorcana-engine/cards/006";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Voyage", () => {
//   describe("Move up to 2 characters of yours to the same location for free.", () => {
//     it("Moving two characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: voyage.cost,
//         hand: [voyage],
//         play: [
//           sugarRushSpeedwayFinishLine,
//           vanellopeVonSchweetzSugarRushPrincess,
//           vanellopeVonSchweetzSugarRushChamp,
//         ],
//       });
//
//       await testEngine.playCard(
//         voyage,
//         {
//           targets: [
//             vanellopeVonSchweetzSugarRushPrincess,
//             vanellopeVonSchweetzSugarRushChamp,
//           ],
//         },
//         true,
//       );
//       await testEngine.resolveTopOfStack({
//         targets: [sugarRushSpeedwayFinishLine],
//       });
//
//       expect(
//         testEngine.getCardModel(sugarRushSpeedwayFinishLine)
//           .charactersAtLocation,
//       ).toHaveLength(2);
//     });
//
//     it("Moving one character", async () => {
//       const testEngine = new TestEngine({
//         inkwell: voyage.cost,
//         hand: [voyage],
//         play: [
//           sugarRushSpeedwayFinishLine,
//           vanellopeVonSchweetzSugarRushPrincess,
//           vanellopeVonSchweetzSugarRushChamp,
//         ],
//       });
//
//       await testEngine.playCard(
//         voyage,
//         {
//           targets: [vanellopeVonSchweetzSugarRushChamp],
//         },
//         true,
//       );
//       await testEngine.resolveTopOfStack({
//         targets: [sugarRushSpeedwayFinishLine],
//       });
//
//       expect(
//         testEngine.getCardModel(sugarRushSpeedwayFinishLine)
//           .charactersAtLocation,
//       ).toHaveLength(1);
//     });
//   });
// });
//
