// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MirabelMadrigalMusicallyTalented,
//   SoMuchToGive,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mirabel Madrigal - Musically Talented", () => {
//   It("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mirabel Madrigal.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mirabelMadrigalMusicallyTalented],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       MirabelMadrigalMusicallyTalented,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("HER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mirabelMadrigalMusicallyTalented],
//       Discard: [soMuchToGive],
//     });
//
//     Await testEngine.questCard(mirabelMadrigalMusicallyTalented);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [soMuchToGive] });
//
//     Expect(testEngine.getCardModel(soMuchToGive).zone).toBe("hand");
//   });
// });
//
