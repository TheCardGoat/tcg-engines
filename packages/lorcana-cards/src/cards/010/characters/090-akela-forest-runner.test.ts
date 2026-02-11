// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { akelaForestRunner } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Akela - Forest Runner", () => {
//   Describe("AHEAD OF THE PACK - 1 {I} — This character gets +1 {S} this turn", () => {
//     It("should have an activated ability that costs 1 ink", () => {
//       Const activatedAbility = akelaForestRunner.abilities?.find(
//         (a) => "type" in a && a.type === "activated",
//       );
//
//       Expect(activatedAbility).toBeDefined();
//
//       If (activatedAbility && "costs" in activatedAbility) {
//         Expect(activatedAbility.costs).toEqual([{ type: "ink", amount: 1 }]);
//       }
//     });
//
//     It("should have base strength of 2", () => {
//       Const testEngine = new TestEngine({
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       Expect(cardUnderTest.strength).toBe(2);
//       Expect(cardUnderTest.strength).toBe(akelaForestRunner.strength);
//     });
//
//     It("should gain +1 strength this turn when activated", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 1,
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Before activation
//       Expect(cardUnderTest.strength).toBe(2);
//
//       // Activate the ability
//       Await testEngine.activateCard(akelaForestRunner);
//
//       // After activation - should have +1 strength
//       Expect(cardUnderTest.strength).toBe(3); // 2 + 1
//     });
//
//     It("should not be able to activate without enough ink", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 0,
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // With no ink, strength should remain at base
//       Expect(cardUnderTest.strength).toBe(2);
//
//       // The ability exists but cannot be activated without ink
//       Const hasActivatedAbility = akelaForestRunner.abilities?.some(
//         (a) => "type" in a && a.type === "activated",
//       );
//       Expect(hasActivatedAbility).toBe(true);
//     });
//
//     It("should be able to activate multiple times with enough ink", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Before activation
//       Expect(cardUnderTest.strength).toBe(2);
//
//       // First activation
//       Await testEngine.activateCard(akelaForestRunner);
//       Expect(cardUnderTest.strength).toBe(3); // 2 + 1
//
//       // Second activation
//       Await testEngine.activateCard(akelaForestRunner);
//       Expect(cardUnderTest.strength).toBe(4); // 2 + 1 + 1
//
//       // Third activation
//       Await testEngine.activateCard(akelaForestRunner);
//       Expect(cardUnderTest.strength).toBe(5); // 2 + 1 + 1 + 1
//     });
//
//     It("should lose the strength bonus at the end of the turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 1,
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Activate the ability
//       Await testEngine.activateCard(akelaForestRunner);
//       Expect(cardUnderTest.strength).toBe(3); // 2 + 1
//
//       // Pass turn to trigger end of turn cleanup
//       Await testEngine.passTurn();
//
//       // After turn ends, strength should be back to base
//       Expect(cardUnderTest.strength).toBe(2);
//     });
//
//     It("should maintain the strength bonus during the turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 1,
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Activate the ability
//       Await testEngine.activateCard(akelaForestRunner);
//       Expect(cardUnderTest.strength).toBe(3);
//
//       // Check multiple times during the same turn
//       Expect(cardUnderTest.strength).toBe(3);
//       Expect(cardUnderTest.strength).toBe(3);
//     });
//
//     It("should stack with other strength modifiers", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 2,
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Activate twice
//       Await testEngine.activateCard(akelaForestRunner);
//       Await testEngine.activateCard(akelaForestRunner);
//
//       // Should have +2 strength from two activations
//       Expect(cardUnderTest.strength).toBe(4); // 2 + 1 + 1
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       Expect(cardUnderTest.strength).toBe(2);
//       Expect(cardUnderTest.willpower).toBe(5);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(3);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(akelaForestRunner.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(akelaForestRunner.characteristics).toEqual(["storyborn", "ally"]);
//     });
//
//     It("should be emerald color", () => {
//       Expect(akelaForestRunner.colors).toEqual(["emerald"]);
//     });
//
//     It("should be common rarity", () => {
//       Expect(akelaForestRunner.rarity).toBe("common");
//     });
//   });
//
//   Describe("Gameplay", () => {
//     It("should be playable from hand", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: akelaForestRunner.cost,
//         Hand: [akelaForestRunner],
//       });
//
//       Await testEngine.playCard(akelaForestRunner);
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("should be able to activate ability on the same turn it's played", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: akelaForestRunner.cost + 1,
//         Hand: [akelaForestRunner],
//       });
//
//       // Play the card
//       Await testEngine.playCard(akelaForestRunner);
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//       Expect(cardUnderTest.zone).toBe("play");
//
//       // Activate the ability on the same turn
//       Await testEngine.activateCard(akelaForestRunner);
//
//       // Should have +1 strength
//       Expect(cardUnderTest.strength).toBe(3); // 2 + 1
//     });
//
//     It("should be able to activate ability even when exerted", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 1,
//         Play: [akelaForestRunner],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(akelaForestRunner);
//
//       // Exert the card (simulating it quested)
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(cardUnderTest.ready).toBe(false);
//       Expect(cardUnderTest.strength).toBe(2);
//
//       // Can still activate the ability after being exerted (doesn't require exerting)
//       Await testEngine.activateCard(akelaForestRunner);
//       Expect(cardUnderTest.strength).toBe(3); // 2 + 1
//     });
//   });
// });
//
