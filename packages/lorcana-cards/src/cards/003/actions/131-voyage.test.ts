// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { voyage } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import {
//   VanellopeVonSchweetzSugarRushChamp,
//   VanellopeVonSchweetzSugarRushPrincess,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { sugarRushSpeedwayFinishLine } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Voyage", () => {
//   Describe("Move up to 2 characters of yours to the same location for free.", () => {
//     It("Moving two characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: voyage.cost,
//         Hand: [voyage],
//         Play: [
//           SugarRushSpeedwayFinishLine,
//           VanellopeVonSchweetzSugarRushPrincess,
//           VanellopeVonSchweetzSugarRushChamp,
//         ],
//       });
//
//       Await testEngine.playCard(
//         Voyage,
//         {
//           Targets: [
//             VanellopeVonSchweetzSugarRushPrincess,
//             VanellopeVonSchweetzSugarRushChamp,
//           ],
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [sugarRushSpeedwayFinishLine],
//       });
//
//       Expect(
//         TestEngine.getCardModel(sugarRushSpeedwayFinishLine)
//           .charactersAtLocation,
//       ).toHaveLength(2);
//     });
//
//     It("Moving one character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: voyage.cost,
//         Hand: [voyage],
//         Play: [
//           SugarRushSpeedwayFinishLine,
//           VanellopeVonSchweetzSugarRushPrincess,
//           VanellopeVonSchweetzSugarRushChamp,
//         ],
//       });
//
//       Await testEngine.playCard(
//         Voyage,
//         {
//           Targets: [vanellopeVonSchweetzSugarRushChamp],
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [sugarRushSpeedwayFinishLine],
//       });
//
//       Expect(
//         TestEngine.getCardModel(sugarRushSpeedwayFinishLine)
//           .charactersAtLocation,
//       ).toHaveLength(1);
//     });
//   });
// });
//
