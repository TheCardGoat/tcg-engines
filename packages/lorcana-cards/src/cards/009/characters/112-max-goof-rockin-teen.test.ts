// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HiddenCoveTranquilHaven,
//   MaxGoofRockinTeen,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Max Goof - Rockin' Teen", () => {
//   It("Singer 5 (This character counts as cost 5 to sing songs.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [maxGoofRockinTeen],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(maxGoofRockinTeen);
//     Expect(cardUnderTest.hasSinger).toBe(true);
//   });
//
//   It("I JUST WANNA STAY HOME This character can't move to locations.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hiddenCoveTranquilHaven.moveCost,
//       Play: [maxGoofRockinTeen, hiddenCoveTranquilHaven],
//     });
//
//     Const maxGoof = testEngine.getCardModel(maxGoofRockinTeen);
//     Const hiddenCove = testEngine.getCardModel(hiddenCoveTranquilHaven);
//
//     Expect(maxGoof.canEnterLocation(hiddenCove)).toBe(false);
//
//     Await testEngine.moveToLocation({
//       Location: hiddenCove,
//       Character: maxGoof,
//       SkipAssertion: true,
//     });
//
//     Expect(maxGoof.isAtLocation(hiddenCove)).toBe(false);
//   });
// });
//
