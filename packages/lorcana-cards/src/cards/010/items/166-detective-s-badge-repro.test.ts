// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   detectivesBadge,
//   judyHoppsLeadDetective,
//   mickeyMouseAmberChampion,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Detective's Badge Bug Repro", () => {
//   it("should allow a non-Detective character to benefit from Judy Hopps buffs when given the badge", async () => {
//     const testEngine = new TestEngine({
//       inkwell: detectivesBadge.cost + 1, // Enough for badge activation
//       play: [detectivesBadge, judyHoppsLeadDetective, mickeyMouseAmberChampion],
//     });
//
//     const badge = testEngine.getCardModel(detectivesBadge);
//     const judy = testEngine.getCardModel(judyHoppsLeadDetective);
//     const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//     // Verify initial state
//     expect(mickey.characteristics).not.toContain("detective");
//     expect(mickey.hasAlert).toBe(false);
//     // Judy gives +2 resist to detectives. Mickey is not a detective yet.
//     expect(mickey.damageReduction()).toBe(0);
//
//     // Activate the badge on Mickey
//     await testEngine.activateCard(badge, {
//       targets: [mickeyMouseAmberChampion],
//     });
//
//     // Verify Mickey is now a detective
//     expect(mickey.characteristics).toContain("detective");
//
//     // Verify Mickey gets Judy's buffs
//     // Judy gives Alert
//     expect(mickey.hasAlert).toBe(true);
//
//     // Judy gives Resist +2. Badge gives Resist +1. Total should be +3.
//     // If the bug exists, this might be 1 (only badge) or 0 (neither, but badge test says it works).
//     // The bug report says "resistance applies but the character still doesn't benefit from detective buffs"
//     // So we expect 1 if bug is present, 3 if fixed.
//     expect(mickey.damageReduction()).toBe(3);
//   });
// });
//
