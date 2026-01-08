// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   akelaForestRunner,
//   diabloWatchfulRaven,
//   shereKhanFearsomeTiger,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Shere Khan - Fearsome Tiger", () => {
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [shereKhanFearsomeTiger],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(shereKhanFearsomeTiger);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it("ON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [shereKhanFearsomeTiger],
//       },
//       {
//         play: [akelaForestRunner, diabloWatchfulRaven],
//       },
//     );
//
//     await testEngine.setCardDamage(akelaForestRunner, 1);
//     await testEngine.questCard(shereKhanFearsomeTiger);
//
//     expect(testEngine.stackLayers.length).toBe(1);
//
//     // First resolve banish effect
//     await testEngine.resolveTopOfStack({ targets: [akelaForestRunner] }, true);
//     expect(testEngine.getCardModel(akelaForestRunner).zone).toBe("discard");
//
//     expect(testEngine.stackLayers.length).toBe(1);
//
//     // Then resolve put damage effect (optional layer needs to be accepted first)
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [diabloWatchfulRaven] });
//     expect(testEngine.getCardModel(diabloWatchfulRaven).damage).toBe(1);
//
//     expect(testEngine.stackLayers.length).toBe(0);
//   });
//
//   it("ON THE HUNT - Second effect should activate even if no opposing damaged characters to banish", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [shereKhanFearsomeTiger],
//       },
//       {
//         play: [akelaForestRunner, diabloWatchfulRaven],
//       },
//     );
//
//     await testEngine.questCard(shereKhanFearsomeTiger);
//
//     expect(testEngine.stackLayers.length).toBe(1);
//
//     // This is the case where we DO active the ability even when there's not damaged character
//     // First effect (banish) auto-resolves since it's mandatory but has no valid targets
//     // Second effect (put damage) should still be available
//     await testEngine.acceptOptionalAbility(); // Accept the put damage layer
//     await testEngine.resolveTopOfStack({ targets: [diabloWatchfulRaven] });
//     expect(testEngine.getCardModel(diabloWatchfulRaven).damage).toBe(1);
//
//     expect(testEngine.stackLayers.length).toBe(0);
//   });
// });
//
