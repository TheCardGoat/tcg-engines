// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   aWholeNewWorld,
//   letItGo,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { gazelleBalladSinger } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gazelle - Ballad Singer", () => {
//   describe("Singer 7", () => {
//     it("should have Singer 7 ability", () => {
//       const testEngine = new TestEngine({
//         play: [gazelleBalladSinger],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(gazelleBalladSinger);
//       expect(cardUnderTest.hasSinger).toBe(true);
//     });
//   });
//
//   describe("CROWD FAVORITE", () => {
//     it("should allow putting a song card from discard on top of deck", async () => {
//       const testEngine = new TestEngine({
//         inkwell: gazelleBalladSinger.cost,
//         hand: [gazelleBalladSinger],
//         discard: [letItGo],
//       });
//
//       const song = testEngine.getCardModel(letItGo);
//       expect(song.zone).toBe("discard");
//
//       await testEngine.playCard(gazelleBalladSinger);
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [letItGo] });
//
//       expect(song.zone).toBe("deck");
//     });
//
//     it("should work with different song cards", async () => {
//       const testEngine = new TestEngine({
//         inkwell: gazelleBalladSinger.cost,
//         hand: [gazelleBalladSinger],
//         discard: [aWholeNewWorld],
//       });
//
//       const song = testEngine.getCardModel(aWholeNewWorld);
//       expect(song.zone).toBe("discard");
//
//       await testEngine.playCard(gazelleBalladSinger);
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [aWholeNewWorld] });
//
//       expect(song.zone).toBe("deck");
//     });
//
//     // Note: The ability is optional as implemented, but we don't test declining
//     // since TestEngine doesn't have a declineOptionalLayer method
//
//     it("should only target song cards in discard", async () => {
//       const testEngine = new TestEngine({
//         inkwell: gazelleBalladSinger.cost,
//         hand: [gazelleBalladSinger],
//         discard: [letItGo, aWholeNewWorld],
//       });
//
//       const song1 = testEngine.getCardModel(letItGo);
//       const song2 = testEngine.getCardModel(aWholeNewWorld);
//
//       await testEngine.playCard(gazelleBalladSinger);
//       await testEngine.acceptOptionalLayer();
//
//       // Choose one song
//       await testEngine.resolveTopOfStack({ targets: [letItGo] });
//
//       expect(song1.zone).toBe("deck");
//       expect(song2.zone).toBe("discard");
//     });
//   });
// });
//
