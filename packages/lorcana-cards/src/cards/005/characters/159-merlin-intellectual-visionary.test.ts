// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { merlinIntellectualVisionary } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Merlin - Intellectual Visionary", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: merlinIntellectualVisionary.cost,
//       play: [merlinIntellectualVisionary],
//     });
//
//     const cardUnderTest = testStore.getCard(merlinIntellectualVisionary);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
// describe("Regression Tests", () => {
//   it("should let you play Merlin - Intellectual Visionary", async () => {
//     const testEngine = new TestEngine({
//       inkwell: merlinIntellectualVisionary.cost,
//       hand: [merlinIntellectualVisionary],
//     });
//
//     await testEngine.playCard(merlinIntellectualVisionary);
//
//     expect(testEngine.testStore.getCard(merlinIntellectualVisionary).zone).toBe(
//       "play",
//     );
//   });
// });
//
