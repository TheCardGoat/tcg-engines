// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DetectivesBadge,
//   MickeyMouseAmberChampion,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Detective's Badge", () => {
//   Describe("PROTECT AND SERVE - {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn", () => {
//     It("should grant Resist +1 to chosen character until next turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: detectivesBadge.cost + 1,
//         Play: [detectivesBadge, mickeyMouseAmberChampion],
//       });
//
//       Const badge = testEngine.getCardModel(detectivesBadge);
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should have no resist initially
//       Expect(mickey.hasResist).toBe(false);
//       Expect(mickey.damageReduction()).toBe(0);
//
//       // Activate the ability
//       Await testEngine.activateCard(badge, {
//         Targets: [mickeyMouseAmberChampion],
//       });
//
//       // Mickey should have Resist +1
//       Expect(mickey.hasResist).toBe(true);
//       Expect(mickey.damageReduction()).toBe(1);
//
//       // Pass to opponent's turn and then back to our turn
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       // At the start of our next turn, resist should be removed
//       Expect(mickey.hasResist).toBe(false);
//       Expect(mickey.damageReduction()).toBe(0);
//     });
//
//     It("should grant Detective classification to chosen character until next turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: detectivesBadge.cost + 1,
//         Play: [detectivesBadge, mickeyMouseAmberChampion],
//       });
//
//       Const badge = testEngine.getCardModel(detectivesBadge);
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should not have Detective classification initially
//       Expect(mickey.characteristics.includes("detective")).toBe(false);
//
//       // Activate the ability
//       Await testEngine.activateCard(badge, {
//         Targets: [mickeyMouseAmberChampion],
//       });
//
//       // Mickey should have Detective classification
//       Expect(mickey.characteristics.includes("detective")).toBe(true);
//
//       // Pass to opponent's turn and then back to our turn
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       // At the start of our next turn, Detective classification should be removed
//       Expect(mickey.characteristics.includes("detective")).toBe(false);
//     });
//
//     It("should grant both Resist and Detective to the same character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: detectivesBadge.cost + 1,
//         Play: [detectivesBadge, mickeyMouseAmberChampion],
//       });
//
//       Const badge = testEngine.getCardModel(detectivesBadge);
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Activate the ability
//       Await testEngine.activateCard(badge, {
//         Targets: [mickeyMouseAmberChampion],
//       });
//
//       // Mickey should have both Resist +1 and Detective
//       Expect(mickey.hasResist).toBe(true);
//       Expect(mickey.damageReduction()).toBe(1);
//       Expect(mickey.characteristics.includes("detective")).toBe(true);
//     });
//   });
// });
//
