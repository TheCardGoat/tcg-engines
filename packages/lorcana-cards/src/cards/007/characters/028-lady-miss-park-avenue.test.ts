// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pigletPoohPirateCaptain } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { ladyMissParkAvenue } from "@lorcanito/lorcana-engine/cards/007";
// Import { daleBumbler } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { ladyDecisiveDog } from "../../008/character/033-lady-decisive-dog";
// Import { trampObservantGuardian } from "../../008/character/087-tramp-observant-guardian";
//
// Describe("Lady - Miss Park Avenue", () => {
//   It("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [ladyMissParkAvenue],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(ladyMissParkAvenue);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("SOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: ladyMissParkAvenue.cost,
//       Hand: [ladyMissParkAvenue],
//       Discard: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
//     });
//
//     Await testEngine.playCard(ladyMissParkAvenue);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({
//       Targets: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
//     });
//     Expect(testEngine.getCardModel(daisyDuckDonaldsDate).zone).toBe("hand");
//     Expect(testEngine.getCardModel(pigletPoohPirateCaptain).zone).toBe("hand");
//   });
//
//   It("SOMETHING WONDERFUL - Allows 1 character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: ladyMissParkAvenue.cost,
//       Hand: [ladyMissParkAvenue],
//       Discard: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
//     });
//
//     Await testEngine.playCard(ladyMissParkAvenue);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [daisyDuckDonaldsDate] });
//     Expect(testEngine.getCardModel(daisyDuckDonaldsDate).zone).toBe("hand");
//     Expect(testEngine.getCardModel(pigletPoohPirateCaptain).zone).toBe(
//       "discard",
//     );
//   });
//
//   It("Strength bonus persists after shifting onto Lady - Decisive Dog, and shift triggers Lady's own ability", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: ladyMissParkAvenue.cost + 10,
//       Hand: [ladyMissParkAvenue, daleBumbler],
//       Play: [ladyDecisiveDog],
//     });
//
//     Const decisiveDogModel = testEngine.getCardModel(ladyDecisiveDog);
//
//     // Lady Decisive Dog starts with 0 strength
//     Expect(decisiveDogModel.strength).toBe(0);
//
//     // Play Dale to trigger Lady's "PACK OF HER OWN" (+1 {S} this turn)
//     Await testEngine.playCard(daleBumbler);
//     Expect(decisiveDogModel.strength).toBe(1);
//
//     // Shift Miss Park Avenue onto Decisive Dog
//     Await testEngine.shiftCard({
//       Shifted: ladyDecisiveDog,
//       Shifter: ladyMissParkAvenue,
//     });
//
//     // The shift counts as "playing a character", so Lady's "PACK OF HER OWN" triggers again
//     // targeting herself (she's still in play, under Miss Park Avenue)
//     Await testEngine.acceptOptionalLayerBySource({
//       Source: ladyDecisiveDog,
//       SkipAssertion: true,
//     });
//
//     Const missParKAvenueModel = testEngine.getCardModel(ladyMissParkAvenue);
//
//     // Miss Park Avenue inherits Lady's strength bonuses
//     // Lady had +2 total (+1 from Dale, +1 from the shift), so Miss Park Avenue should have base 4 + 2 = 6
//     Expect(missParKAvenueModel.zone).toBe("play");
//     Expect(missParKAvenueModel.strength).toBe(ladyMissParkAvenue.strength + 2); // Base 4 + 2 inherited from Lady (who triggered twice)
//   });
// });
//
