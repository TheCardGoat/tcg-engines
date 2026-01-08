// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { akelaForestRunner } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Akela - Forest Runner", () => {
//   describe("AHEAD OF THE PACK - 1 {I} — This character gets +1 {S} this turn", () => {
//     it("should have an activated ability that costs 1 ink", () => {
//       const activatedAbility = akelaForestRunner.abilities?.find(
//         (a) => "type" in a && a.type === "activated",
//       );
//
//       expect(activatedAbility).toBeDefined();
//
//       if (activatedAbility && "costs" in activatedAbility) {
//         expect(activatedAbility.costs).toEqual([{ type: "ink", amount: 1 }]);
//       }
//     });
//
//     it("should have base strength of 2", () => {
//       const testEngine = new TestEngine({
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       expect(cardUnderTest.strength).toBe(2);
//       expect(cardUnderTest.strength).toBe(akelaForestRunner.strength);
//     });
//
//     it("should gain +1 strength this turn when activated", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 1,
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Before activation
//       expect(cardUnderTest.strength).toBe(2);
//
//       // Activate the ability
//       await testEngine.activateCard(akelaForestRunner);
//
//       // After activation - should have +1 strength
//       expect(cardUnderTest.strength).toBe(3); // 2 + 1
//     });
//
//     it("should not be able to activate without enough ink", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 0,
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // With no ink, strength should remain at base
//       expect(cardUnderTest.strength).toBe(2);
//
//       // The ability exists but cannot be activated without ink
//       const hasActivatedAbility = akelaForestRunner.abilities?.some(
//         (a) => "type" in a && a.type === "activated",
//       );
//       expect(hasActivatedAbility).toBe(true);
//     });
//
//     it("should be able to activate multiple times with enough ink", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Before activation
//       expect(cardUnderTest.strength).toBe(2);
//
//       // First activation
//       await testEngine.activateCard(akelaForestRunner);
//       expect(cardUnderTest.strength).toBe(3); // 2 + 1
//
//       // Second activation
//       await testEngine.activateCard(akelaForestRunner);
//       expect(cardUnderTest.strength).toBe(4); // 2 + 1 + 1
//
//       // Third activation
//       await testEngine.activateCard(akelaForestRunner);
//       expect(cardUnderTest.strength).toBe(5); // 2 + 1 + 1 + 1
//     });
//
//     it("should lose the strength bonus at the end of the turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 1,
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Activate the ability
//       await testEngine.activateCard(akelaForestRunner);
//       expect(cardUnderTest.strength).toBe(3); // 2 + 1
//
//       // Pass turn to trigger end of turn cleanup
//       await testEngine.passTurn();
//
//       // After turn ends, strength should be back to base
//       expect(cardUnderTest.strength).toBe(2);
//     });
//
//     it("should maintain the strength bonus during the turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 1,
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Activate the ability
//       await testEngine.activateCard(akelaForestRunner);
//       expect(cardUnderTest.strength).toBe(3);
//
//       // Check multiple times during the same turn
//       expect(cardUnderTest.strength).toBe(3);
//       expect(cardUnderTest.strength).toBe(3);
//     });
//
//     it("should stack with other strength modifiers", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 2,
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Activate twice
//       await testEngine.activateCard(akelaForestRunner);
//       await testEngine.activateCard(akelaForestRunner);
//
//       // Should have +2 strength from two activations
//       expect(cardUnderTest.strength).toBe(4); // 2 + 1 + 1
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       expect(cardUnderTest.strength).toBe(2);
//       expect(cardUnderTest.willpower).toBe(5);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should be inkwell card", () => {
//       expect(akelaForestRunner.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(akelaForestRunner.characteristics).toEqual(["storyborn", "ally"]);
//     });
//
//     it("should be emerald color", () => {
//       expect(akelaForestRunner.colors).toEqual(["emerald"]);
//     });
//
//     it("should be common rarity", () => {
//       expect(akelaForestRunner.rarity).toBe("common");
//     });
//   });
//
//   describe("Gameplay", () => {
//     it("should be playable from hand", async () => {
//       const testEngine = new TestEngine({
//         inkwell: akelaForestRunner.cost,
//         hand: [akelaForestRunner],
//       });
//
//       await testEngine.playCard(akelaForestRunner);
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("should be able to activate ability on the same turn it's played", async () => {
//       const testEngine = new TestEngine({
//         inkwell: akelaForestRunner.cost + 1,
//         hand: [akelaForestRunner],
//       });
//
//       // Play the card
//       await testEngine.playCard(akelaForestRunner);
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//       expect(cardUnderTest.zone).toBe("play");
//
//       // Activate the ability on the same turn
//       await testEngine.activateCard(akelaForestRunner);
//
//       // Should have +1 strength
//       expect(cardUnderTest.strength).toBe(3); // 2 + 1
//     });
//
//     it("should be able to activate ability even when exerted", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 1,
//         play: [akelaForestRunner],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Exert the card (simulating it quested)
//       cardUnderTest.updateCardMeta({ exerted: true });
//       expect(cardUnderTest.ready).toBe(false);
//       expect(cardUnderTest.strength).toBe(2);
//
//       // Can still activate the ability after being exerted (doesn't require exerting)
//       await testEngine.activateCard(akelaForestRunner);
//       expect(cardUnderTest.strength).toBe(3); // 2 + 1
//     });
//   });
// });
//
