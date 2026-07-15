// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuckNotAgain } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Not Again!", () => {
//   It("Evasive", () => {
//     Const testStore = new TestStore({
//       Inkwell: donaldDuckNotAgain.cost,
//       Play: [donaldDuckNotAgain],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DonaldDuckNotAgain.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("**PHOOEY!** This character gets +1 {L} for each 1 damage on him.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: donaldDuckNotAgain.cost,
//       Play: [donaldDuckNotAgain],
//     });
//
//     Await testEngine.setCardDamage(donaldDuckNotAgain, 4);
//     Expect(testEngine.getPlayerLore()).toBe(0);
//     Await testEngine.questCard(donaldDuckNotAgain);
//     Expect(testEngine.getPlayerLore()).toBe(5);
//   });
// });
//
