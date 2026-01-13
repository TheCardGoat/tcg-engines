// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pigletPoohPirateCaptain } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { ladyMissParkAvenue } from "@lorcanito/lorcana-engine/cards/007";
// import { daleBumbler } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { ladyDecisiveDog } from "../../008/character/033-lady-decisive-dog";
// import { trampObservantGuardian } from "../../008/character/087-tramp-observant-guardian";
//
// describe("Lady - Miss Park Avenue", () => {
//   it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)", async () => {
//     const testEngine = new TestEngine({
//       play: [ladyMissParkAvenue],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ladyMissParkAvenue);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("SOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: ladyMissParkAvenue.cost,
//       hand: [ladyMissParkAvenue],
//       discard: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
//     });
//
//     await testEngine.playCard(ladyMissParkAvenue);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({
//       targets: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
//     });
//     expect(testEngine.getCardModel(daisyDuckDonaldsDate).zone).toBe("hand");
//     expect(testEngine.getCardModel(pigletPoohPirateCaptain).zone).toBe("hand");
//   });
//
//   it("SOMETHING WONDERFUL - Allows 1 character", async () => {
//     const testEngine = new TestEngine({
//       inkwell: ladyMissParkAvenue.cost,
//       hand: [ladyMissParkAvenue],
//       discard: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
//     });
//
//     await testEngine.playCard(ladyMissParkAvenue);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [daisyDuckDonaldsDate] });
//     expect(testEngine.getCardModel(daisyDuckDonaldsDate).zone).toBe("hand");
//     expect(testEngine.getCardModel(pigletPoohPirateCaptain).zone).toBe(
//       "discard",
//     );
//   });
//
//   it("Strength bonus persists after shifting onto Lady - Decisive Dog, and shift triggers Lady's own ability", async () => {
//     const testEngine = new TestEngine({
//       inkwell: ladyMissParkAvenue.cost + 10,
//       hand: [ladyMissParkAvenue, daleBumbler],
//       play: [ladyDecisiveDog],
//     });
//
//     const decisiveDogModel = testEngine.getCardModel(ladyDecisiveDog);
//
//     // Lady Decisive Dog starts with 0 strength
//     expect(decisiveDogModel.strength).toBe(0);
//
//     // Play Dale to trigger Lady's "PACK OF HER OWN" (+1 {S} this turn)
//     await testEngine.playCard(daleBumbler);
//     expect(decisiveDogModel.strength).toBe(1);
//
//     // Shift Miss Park Avenue onto Decisive Dog
//     await testEngine.shiftCard({
//       shifted: ladyDecisiveDog,
//       shifter: ladyMissParkAvenue,
//     });
//
//     // The shift counts as "playing a character", so Lady's "PACK OF HER OWN" triggers again
//     // targeting herself (she's still in play, under Miss Park Avenue)
//     await testEngine.acceptOptionalLayerBySource({
//       source: ladyDecisiveDog,
//       skipAssertion: true,
//     });
//
//     const missParKAvenueModel = testEngine.getCardModel(ladyMissParkAvenue);
//
//     // Miss Park Avenue inherits Lady's strength bonuses
//     // Lady had +2 total (+1 from Dale, +1 from the shift), so Miss Park Avenue should have base 4 + 2 = 6
//     expect(missParKAvenueModel.zone).toBe("play");
//     expect(missParKAvenueModel.strength).toBe(ladyMissParkAvenue.strength + 2); // Base 4 + 2 inherited from Lady (who triggered twice)
//   });
// });
//
