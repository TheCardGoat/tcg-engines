// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CaptainHookUnderhanded,
//   DonaldDuckFirstMate,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Donald Duck - First Mate", () => {
//   It("CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.", async () => {
//     // Test with no Captain in play
//     Const testEngine = new TestEngine({
//       Inkwell: donaldDuckFirstMate.cost,
//       Hand: [donaldDuckFirstMate],
//     });
//
//     Await testEngine.playCard(donaldDuckFirstMate);
//
//     Const donaldCard = testEngine.getCardModel(donaldDuckFirstMate);
//     Expect(donaldCard.lore).toEqual(donaldDuckFirstMate.lore);
//
//     // Test with a Captain in play
//     Const testEngineWithCaptain = new TestEngine({
//       Inkwell: donaldDuckFirstMate.cost + captainHookUnderhanded.cost,
//       Play: [captainHookUnderhanded],
//       Hand: [donaldDuckFirstMate],
//     });
//
//     Await testEngineWithCaptain.playCard(donaldDuckFirstMate);
//
//     Const donaldCardWithCaptain =
//       TestEngineWithCaptain.getCardModel(donaldDuckFirstMate);
//     Expect(donaldCardWithCaptain.lore).toEqual(donaldDuckFirstMate.lore + 2);
//   });
// });
//
