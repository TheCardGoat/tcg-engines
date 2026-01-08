// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   bellwetherAssistantMayor,
//   captainHookUnderhanded,
//   donaldDuckFirstMate,
//   jasmineRoyalSeafarer,
//   wendyDarlingCourageousCaptain,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Captain Hook - Underhanded", () => {
//   it("INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [
//           donaldDuckFirstMate,
//           wendyDarlingCourageousCaptain,
//           bellwetherAssistantMayor,
//         ],
//       },
//       {
//         play: [captainHookUnderhanded],
//       },
//     );
//
//     expect(
//       testEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
//     ).toBe(false);
//     expect(
//       testEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
//     ).toBe(false);
//
//     await testEngine.tapCard(captainHookUnderhanded);
//
//     expect(
//       testEngine.getCardModel(bellwetherAssistantMayor).hasQuestRestriction,
//     ).toBe(false);
//     expect(
//       testEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
//     ).toBe(true);
//     expect(
//       testEngine.getCardModel(donaldDuckFirstMate).hasQuestRestriction,
//     ).toBe(true);
//   });
//
//   it("UPPER HAND Whenever this character is challenged, draw a card.", async () => {
//     const testEngine = new TestEngine(
//       {
//         hand: [jasmineRoyalSeafarer],
//       },
//       {
//         play: [captainHookUnderhanded],
//         deck: 7,
//       },
//     );
//
//     await testEngine.challenge({
//       attacker: jasmineRoyalSeafarer,
//       defender: captainHookUnderhanded,
//       exertDefender: true,
//     });
//
//     expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       expect.objectContaining({
//         hand: 1,
//         deck: 6,
//       }),
//     );
//   });
// });
//
