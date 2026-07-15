// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import {
//   DopeyKnightApprentice,
//   MickeyMouseFoodFightDefender,
//   RoyalGuardBovineProtector,
//   SleepySluggishKnight,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { sevenDwarfsMineSecureFortress } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Seven Dwarfs' Mine - Secure Fortress", () => {
//   Describe("**MOUNTAIN DEFENSE** During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.", () => {
//     It("should deal 2 damage to chosen character, when moving a Knight", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: sevenDwarfsMineSecureFortress.moveCost * 2,
//         Play: [
//           SevenDwarfsMineSecureFortress,
//           SleepySluggishKnight,
//           DopeyKnightApprentice,
//         ],
//       });
//
//       Const { character } = await testEngine.moveToLocation({
//         Location: sevenDwarfsMineSecureFortress,
//         Character: sleepySluggishKnight,
//       });
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [character] });
//
//       Expect(character.damage).toBe(2);
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       Await testEngine.moveToLocation({
//         Location: sevenDwarfsMineSecureFortress,
//         Character: dopeyKnightApprentice,
//       });
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     It("should deal 1 damage to chosen character, when moving a Non-Knight", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: sevenDwarfsMineSecureFortress.moveCost * 2,
//         Play: [
//           SevenDwarfsMineSecureFortress,
//           RoyalGuardBovineProtector,
//           MickeyMouseFoodFightDefender,
//         ],
//       });
//
//       Const { character } = await testEngine.moveToLocation({
//         Location: sevenDwarfsMineSecureFortress,
//         Character: royalGuardBovineProtector,
//       });
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [character] });
//
//       Expect(character.damage).toBe(1);
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       Await testEngine.moveToLocation({
//         Location: sevenDwarfsMineSecureFortress,
//         Character: mickeyMouseFoodFightDefender,
//       });
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Do not trigger when moving to another location", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hiddenCoveTranquilHaven.moveCost,
//       Play: [
//         SevenDwarfsMineSecureFortress,
//         HiddenCoveTranquilHaven,
//         RoyalGuardBovineProtector,
//         MickeyMouseFoodFightDefender,
//       ],
//     });
//
//     Await testEngine.moveToLocation({
//       Location: hiddenCoveTranquilHaven,
//       Character: royalGuardBovineProtector,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
