// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AWholeNewWorld,
//   LetItGo,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { gazelleBalladSinger } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gazelle - Ballad Singer", () => {
//   Describe("Singer 7", () => {
//     It("should have Singer 7 ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [gazelleBalladSinger],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(gazelleBalladSinger);
//       Expect(cardUnderTest.hasSinger).toBe(true);
//     });
//   });
//
//   Describe("CROWD FAVORITE", () => {
//     It("should allow putting a song card from discard on top of deck", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: gazelleBalladSinger.cost,
//         Hand: [gazelleBalladSinger],
//         Discard: [letItGo],
//       });
//
//       Const song = testEngine.getCardModel(letItGo);
//       Expect(song.zone).toBe("discard");
//
//       Await testEngine.playCard(gazelleBalladSinger);
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [letItGo] });
//
//       Expect(song.zone).toBe("deck");
//     });
//
//     It("should work with different song cards", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: gazelleBalladSinger.cost,
//         Hand: [gazelleBalladSinger],
//         Discard: [aWholeNewWorld],
//       });
//
//       Const song = testEngine.getCardModel(aWholeNewWorld);
//       Expect(song.zone).toBe("discard");
//
//       Await testEngine.playCard(gazelleBalladSinger);
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [aWholeNewWorld] });
//
//       Expect(song.zone).toBe("deck");
//     });
//
//     // Note: The ability is optional as implemented, but we don't test declining
//     // since TestEngine doesn't have a declineOptionalLayer method
//
//     It("should only target song cards in discard", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: gazelleBalladSinger.cost,
//         Hand: [gazelleBalladSinger],
//         Discard: [letItGo, aWholeNewWorld],
//       });
//
//       Const song1 = testEngine.getCardModel(letItGo);
//       Const song2 = testEngine.getCardModel(aWholeNewWorld);
//
//       Await testEngine.playCard(gazelleBalladSinger);
//       Await testEngine.acceptOptionalLayer();
//
//       // Choose one song
//       Await testEngine.resolveTopOfStack({ targets: [letItGo] });
//
//       Expect(song1.zone).toBe("deck");
//       Expect(song2.zone).toBe("discard");
//     });
//   });
// });
//
