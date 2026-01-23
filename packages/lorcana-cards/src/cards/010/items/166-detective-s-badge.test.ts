// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   detectivesBadge,
//   mickeyMouseAmberChampion,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Detective's Badge", () => {
//   describe("PROTECT AND SERVE - {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn", () => {
//     it("should grant Resist +1 to chosen character until next turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: detectivesBadge.cost + 1,
//         play: [detectivesBadge, mickeyMouseAmberChampion],
//       });
//
//       const badge = testEngine.getCardModel(detectivesBadge);
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should have no resist initially
//       expect(mickey.hasResist).toBe(false);
//       expect(mickey.damageReduction()).toBe(0);
//
//       // Activate the ability
//       await testEngine.activateCard(badge, {
//         targets: [mickeyMouseAmberChampion],
//       });
//
//       // Mickey should have Resist +1
//       expect(mickey.hasResist).toBe(true);
//       expect(mickey.damageReduction()).toBe(1);
//
//       // Pass to opponent's turn and then back to our turn
//       testEngine.passTurn();
//       testEngine.passTurn();
//
//       // At the start of our next turn, resist should be removed
//       expect(mickey.hasResist).toBe(false);
//       expect(mickey.damageReduction()).toBe(0);
//     });
//
//     it("should grant Detective classification to chosen character until next turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: detectivesBadge.cost + 1,
//         play: [detectivesBadge, mickeyMouseAmberChampion],
//       });
//
//       const badge = testEngine.getCardModel(detectivesBadge);
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Mickey should not have Detective classification initially
//       expect(mickey.characteristics.includes("detective")).toBe(false);
//
//       // Activate the ability
//       await testEngine.activateCard(badge, {
//         targets: [mickeyMouseAmberChampion],
//       });
//
//       // Mickey should have Detective classification
//       expect(mickey.characteristics.includes("detective")).toBe(true);
//
//       // Pass to opponent's turn and then back to our turn
//       testEngine.passTurn();
//       testEngine.passTurn();
//
//       // At the start of our next turn, Detective classification should be removed
//       expect(mickey.characteristics.includes("detective")).toBe(false);
//     });
//
//     it("should grant both Resist and Detective to the same character", async () => {
//       const testEngine = new TestEngine({
//         inkwell: detectivesBadge.cost + 1,
//         play: [detectivesBadge, mickeyMouseAmberChampion],
//       });
//
//       const badge = testEngine.getCardModel(detectivesBadge);
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Activate the ability
//       await testEngine.activateCard(badge, {
//         targets: [mickeyMouseAmberChampion],
//       });
//
//       // Mickey should have both Resist +1 and Detective
//       expect(mickey.hasResist).toBe(true);
//       expect(mickey.damageReduction()).toBe(1);
//       expect(mickey.characteristics.includes("detective")).toBe(true);
//     });
//   });
// });
//
