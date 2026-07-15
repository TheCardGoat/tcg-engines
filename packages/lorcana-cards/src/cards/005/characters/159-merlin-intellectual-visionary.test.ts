// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { merlinIntellectualVisionary } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin - Intellectual Visionary", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: merlinIntellectualVisionary.cost,
//       Play: [merlinIntellectualVisionary],
//     });
//
//     Const cardUnderTest = testStore.getCard(merlinIntellectualVisionary);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
// Describe("Regression Tests", () => {
//   It("should let you play Merlin - Intellectual Visionary", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: merlinIntellectualVisionary.cost,
//       Hand: [merlinIntellectualVisionary],
//     });
//
//     Await testEngine.playCard(merlinIntellectualVisionary);
//
//     Expect(testEngine.testStore.getCard(merlinIntellectualVisionary).zone).toBe(
//       "play",
//     );
//   });
// });
//
