// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   BrunoMadrigalSingingSeer,
//   DeweyLovableShowoff,
//   LafayetteSleepyDachshund,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bruno Madrigal - Singing Seer", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [brunoMadrigalSingingSeer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(brunoMadrigalSingingSeer);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("BRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         BrunoMadrigalSingingSeer,
//         LafayetteSleepyDachshund,
//         DeweyLovableShowoff,
//       ],
//       Hand: [hakunaMatata],
//     });
//
//     Await testEngine.singSong({
//       Singer: testEngine.getCardModel(brunoMadrigalSingingSeer),
//       Song: hakunaMatata,
//     });
//
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardsByZone("hand").length).toBe(
//       TestEngine.getCardsByZone("play").length,
//     );
//   });
// });
//
