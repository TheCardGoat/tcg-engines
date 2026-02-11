// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { vanellopeVonSchweetzSugarRushChamp } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { sugarRushSpeedwayStartingLine } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { sugarRushSpeedwayFinishLine } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sugar Rush Speedway - Finish Line", () => {
//   Describe("BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.", () => {
//     It("Moving from another location", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           SugarRushSpeedwayFinishLine.moveCost +
//           SugarRushSpeedwayStartingLine.moveCost,
//         Play: [
//           SugarRushSpeedwayStartingLine,
//           SugarRushSpeedwayFinishLine,
//           VanellopeVonSchweetzSugarRushChamp,
//         ],
//         Deck: 10,
//       });
//
//       Await testEngine.moveToLocation({
//         Location: sugarRushSpeedwayStartingLine,
//         Character: vanellopeVonSchweetzSugarRushChamp,
//       });
//
//       Await testEngine.moveToLocation({
//         Location: sugarRushSpeedwayFinishLine,
//         Character: vanellopeVonSchweetzSugarRushChamp,
//       });
//
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.getCardModel(sugarRushSpeedwayFinishLine).zone).toBe(
//         "discard",
//       );
//       Expect(testEngine.getPlayerLore()).toEqual(3);
//       Expect(testEngine.getZonesCardCount().hand).toEqual(3);
//     });
//
//     It("NOT Moving from another location", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: sugarRushSpeedwayFinishLine.moveCost,
//         Play: [sugarRushSpeedwayFinishLine, vanellopeVonSchweetzSugarRushChamp],
//         Deck: 5,
//       });
//
//       Await testEngine.moveToLocation({
//         Location: sugarRushSpeedwayFinishLine,
//         Character: vanellopeVonSchweetzSugarRushChamp,
//       });
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
