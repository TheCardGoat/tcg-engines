// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BellwetherAssistantMayor,
//   CaptainHookUnderhanded,
//   DonaldDuckFirstMate,
//   JasmineRoyalSeafarer,
//   WendyDarlingCourageousCaptain,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Captain Hook - Underhanded", () => {
//   It("INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [
//           DonaldDuckFirstMate,
//           WendyDarlingCourageousCaptain,
//           BellwetherAssistantMayor,
//         ],
//       },
//       {
//         Play: [captainHookUnderhanded],
//       },
//     );
//
//     Expect(
//       TestEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
//     ).toBe(false);
//     Expect(
//       TestEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
//     ).toBe(false);
//
//     Await testEngine.tapCard(captainHookUnderhanded);
//
//     Expect(
//       TestEngine.getCardModel(bellwetherAssistantMayor).hasQuestRestriction,
//     ).toBe(false);
//     Expect(
//       TestEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
//     ).toBe(true);
//     Expect(
//       TestEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
//     ).toBe(true);
//   });
//
//   It("UPPER HAND Whenever this character is challenged, draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Hand: [jasmineRoyalSeafarer],
//       },
//       {
//         Play: [captainHookUnderhanded],
//         Deck: 7,
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: jasmineRoyalSeafarer,
//       Defender: captainHookUnderhanded,
//       ExertDefender: true,
//     });
//
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 6,
//       }),
//     );
//   });
// });
//
