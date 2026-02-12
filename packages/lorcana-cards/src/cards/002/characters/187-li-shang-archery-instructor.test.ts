// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   LiShangArcheryInstructor,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Li Shang- Archery Instructor", () => {
//   It("**ARCHERY LESSON** Whenever this character quests, your characters gain **Evasive** this turn. _(They can challenge characters with Evasive.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [liShangArcheryInstructor, goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(liShangArcheryInstructor);
//     Const target = testEngine.getCardModel(goofyKnightForADay);
//
//     Expect(cardUnderTest.hasEvasive).toBe(false);
//     Expect(target.hasEvasive).toBe(false);
//
//     Await testEngine.questCard(liShangArcheryInstructor);
//
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//     Expect(target.hasEvasive).toBe(true);
//   });
// });
//
