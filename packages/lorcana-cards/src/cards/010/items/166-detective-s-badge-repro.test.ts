// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DetectivesBadge,
//   JudyHoppsLeadDetective,
//   MickeyMouseAmberChampion,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Detective's Badge Bug Repro", () => {
//   It("should allow a non-Detective character to benefit from Judy Hopps buffs when given the badge", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: detectivesBadge.cost + 1, // Enough for badge activation
//       Play: [detectivesBadge, judyHoppsLeadDetective, mickeyMouseAmberChampion],
//     });
//
//     Const badge = testEngine.getCardModel(detectivesBadge);
//     Const judy = testEngine.getCardModel(judyHoppsLeadDetective);
//     Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//     // Verify initial state
//     Expect(mickey.characteristics).not.toContain("detective");
//     Expect(mickey.hasAlert).toBe(false);
//     // Judy gives +2 resist to detectives. Mickey is not a detective yet.
//     Expect(mickey.damageReduction()).toBe(0);
//
//     // Activate the badge on Mickey
//     Await testEngine.activateCard(badge, {
//       Targets: [mickeyMouseAmberChampion],
//     });
//
//     // Verify Mickey is now a detective
//     Expect(mickey.characteristics).toContain("detective");
//
//     // Verify Mickey gets Judy's buffs
//     // Judy gives Alert
//     Expect(mickey.hasAlert).toBe(true);
//
//     // Judy gives Resist +2. Badge gives Resist +1. Total should be +3.
//     // If the bug exists, this might be 1 (only badge) or 0 (neither, but badge test says it works).
//     // The bug report says "resistance applies but the character still doesn't benefit from detective buffs"
//     // So we expect 1 if bug is present, 3 if fixed.
//     Expect(mickey.damageReduction()).toBe(3);
//   });
// });
//
