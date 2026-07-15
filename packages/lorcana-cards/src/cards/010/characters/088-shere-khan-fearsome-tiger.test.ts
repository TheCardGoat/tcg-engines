// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AkelaForestRunner,
//   DiabloWatchfulRaven,
//   ShereKhanFearsomeTiger,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Shere Khan - Fearsome Tiger", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [shereKhanFearsomeTiger],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(shereKhanFearsomeTiger);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("ON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [shereKhanFearsomeTiger],
//       },
//       {
//         Play: [akelaForestRunner, diabloWatchfulRaven],
//       },
//     );
//
//     Await testEngine.setCardDamage(akelaForestRunner, 1);
//     Await testEngine.questCard(shereKhanFearsomeTiger);
//
//     Expect(testEngine.stackLayers.length).toBe(1);
//
//     // First resolve banish effect
//     Await testEngine.resolveTopOfStack({ targets: [akelaForestRunner] }, true);
//     Expect(testEngine.getCardModel(akelaForestRunner).zone).toBe("discard");
//
//     Expect(testEngine.stackLayers.length).toBe(1);
//
//     // Then resolve put damage effect (optional layer needs to be accepted first)
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [diabloWatchfulRaven] });
//     Expect(testEngine.getCardModel(diabloWatchfulRaven).damage).toBe(1);
//
//     Expect(testEngine.stackLayers.length).toBe(0);
//   });
//
//   It("ON THE HUNT - Second effect should activate even if no opposing damaged characters to banish", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [shereKhanFearsomeTiger],
//       },
//       {
//         Play: [akelaForestRunner, diabloWatchfulRaven],
//       },
//     );
//
//     Await testEngine.questCard(shereKhanFearsomeTiger);
//
//     Expect(testEngine.stackLayers.length).toBe(1);
//
//     // This is the case where we DO active the ability even when there's not damaged character
//     // First effect (banish) auto-resolves since it's mandatory but has no valid targets
//     // Second effect (put damage) should still be available
//     Await testEngine.acceptOptionalAbility(); // Accept the put damage layer
//     Await testEngine.resolveTopOfStack({ targets: [diabloWatchfulRaven] });
//     Expect(testEngine.getCardModel(diabloWatchfulRaven).damage).toBe(1);
//
//     Expect(testEngine.stackLayers.length).toBe(0);
//   });
// });
//
