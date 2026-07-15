// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/012-mickey-mouse-true-friend";
// Import { mickeyMouseBraveLittlePrince } from "@lorcanito/lorcana-engine/cards/009/characters/ruby/111-mickey-mouse-brave-little-prince";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Brave Little Prince", () => {
//   It("Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mickeyMouseBraveLittlePrince],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittlePrince);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mickeyMouseBraveLittlePrince],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittlePrince);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("CROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [mickeyMouseTrueFriend],
//       Hand: [mickeyMouseBraveLittlePrince],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittlePrince);
//     // const card  = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//     Await testEngine.shiftCard({
//       Shifted: mickeyMouseTrueFriend,
//       Shifter: mickeyMouseBraveLittlePrince,
//     });
//
//     Expect(cardUnderTest.zone).toBe("play");
//     Expect(cardUnderTest.lore).toBe(mickeyMouseBraveLittlePrince.lore + 3);
//     Expect(cardUnderTest.strength).toBe(
//       MickeyMouseBraveLittlePrince.strength + 3,
//     );
//     Expect(cardUnderTest.willpower).toBe(
//       MickeyMouseBraveLittlePrince.willpower + 3,
//     );
//   });
//
//   It("CROWNING ACHIEVEMENT: no shift", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mickeyMouseBraveLittlePrince],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittlePrince);
//
//     Expect(cardUnderTest.zone).toBe("play");
//     Expect(cardUnderTest.lore).toBe(mickeyMouseBraveLittlePrince.lore);
//     Expect(cardUnderTest.strength).toBe(mickeyMouseBraveLittlePrince.strength);
//     Expect(cardUnderTest.willpower).toBe(
//       MickeyMouseBraveLittlePrince.willpower,
//     );
//   });
//
//   Describe("Regression tests", () => {
//     It("Only gives the buff for the instance, do not give bonus to other mickeys on board", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Play: [mickeyMouseTrueFriend, mickeyMouseBraveLittlePrince],
//         Hand: [mickeyMouseBraveLittlePrince],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MickeyMouseBraveLittlePrince,
//         1,
//       );
//       Expect(cardUnderTest.zone).toBe("hand");
//       Const anotherMickey = testEngine.getCardModel(
//         MickeyMouseBraveLittlePrince,
//         0,
//       );
//       Expect(anotherMickey.zone).toBe("play");
//
//       Await testEngine.shiftCard({
//         Shifted: mickeyMouseTrueFriend,
//         Shifter: cardUnderTest,
//       });
//
//       Expect(anotherMickey.zone).toBe("play");
//       Expect(anotherMickey.lore).toBe(mickeyMouseBraveLittlePrince.lore);
//       Expect(anotherMickey.strength).toBe(
//         MickeyMouseBraveLittlePrince.strength,
//       );
//       Expect(anotherMickey.willpower).toBe(
//         MickeyMouseBraveLittlePrince.willpower,
//       );
//
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(cardUnderTest.lore).toBe(mickeyMouseBraveLittlePrince.lore + 3);
//       Expect(cardUnderTest.strength).toBe(
//         MickeyMouseBraveLittlePrince.strength + 3,
//       );
//       Expect(cardUnderTest.willpower).toBe(
//         MickeyMouseBraveLittlePrince.willpower + 3,
//       );
//     });
//   });
// });
//
