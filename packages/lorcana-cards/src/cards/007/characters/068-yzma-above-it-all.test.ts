// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BelleMechanicExtraordinaire,
//   CybugInvasiveEnemy,
//   HoneyLemonChemistryWhiz,
//   PepperQuickthinkingPuppy,
//   RobinHoodEyeForDetail,
//   YzmaAboveItAll,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yzma - Above It All", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Yzma.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [yzmaAboveItAll],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(yzmaAboveItAll);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [yzmaAboveItAll],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(yzmaAboveItAll);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   // Flaky test
//   Describe.skip("BACK TO WORK Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.", () => {
//     It("Your character is banished", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [yzmaAboveItAll, cybugInvasiveEnemy],
//           Hand: [
//             PepperQuickthinkingPuppy,
//             HoneyLemonChemistryWhiz,
//             RobinHoodEyeForDetail,
//           ],
//         },
//         {
//           Play: [belleMechanicExtraordinaire],
//         },
//       );
//
//       Await testEngine.challenge({
//         Attacker: cybugInvasiveEnemy,
//         Defender: belleMechanicExtraordinaire,
//         ExertDefender: true,
//       });
//
//       Expect(testEngine.getCardModel(cybugInvasiveEnemy).zone).toBe("hand");
//       Expect(testEngine.getCardModel(pepperQuickthinkingPuppy).zone).toBe(
//         "discard",
//       );
//     });
//
//     It("Opponent's character is banished", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [yzmaAboveItAll, belleMechanicExtraordinaire],
//         },
//         {
//           Play: [cybugInvasiveEnemy],
//           Hand: [
//             PepperQuickthinkingPuppy,
//             HoneyLemonChemistryWhiz,
//             RobinHoodEyeForDetail,
//           ],
//         },
//       );
//
//       Await testEngine.challenge({
//         Attacker: belleMechanicExtraordinaire,
//         Defender: cybugInvasiveEnemy,
//         ExertDefender: true,
//       });
//
//       Expect(testEngine.getCardModel(cybugInvasiveEnemy).zone).toBe("hand");
//       Expect(testEngine.getCardModel(pepperQuickthinkingPuppy).zone).toBe(
//         "discard",
//       );
//     });
//   });
// });
//
