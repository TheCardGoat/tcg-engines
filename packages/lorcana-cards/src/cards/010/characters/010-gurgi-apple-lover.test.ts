// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GurgiAppleLover,
//   MrsBeakleyFormerShushAgent,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gurgi - Apple Lover", () => {
//   It("HAPPY DAY - triggers when you play this character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gurgiAppleLover.cost,
//       Hand: [gurgiAppleLover],
//       Play: [mrsBeakleyFormerShushAgent],
//     });
//
//     Const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     TargetCharacter.updateCardDamage(2, "add");
//
//     Expect(targetCharacter.damage).toBe(2);
//
//     Await testEngine.playCard(gurgiAppleLover);
//
//     Expect(testEngine.getCardModel(gurgiAppleLover).zone).toBe("play");
//     Expect(testEngine.store.stackLayerStore.layers.length).toBe(1);
//   });
//
//   It("HAPPY DAY - removes up to 2 damage from chosen character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gurgiAppleLover.cost,
//       Hand: [gurgiAppleLover],
//       Play: [mrsBeakleyFormerShushAgent],
//     });
//
//     Const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     TargetCharacter.updateCardDamage(3, "add");
//
//     Expect(targetCharacter.damage).toBe(3);
//
//     Await testEngine.playCard(gurgiAppleLover);
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Should remove 2 damage, leaving 1 damage
//     Expect(targetCharacter.damage).toBe(1);
//   });
//
//   It("HAPPY DAY - removes exactly the remaining damage if less than 2", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gurgiAppleLover.cost,
//       Hand: [gurgiAppleLover],
//       Play: [mrsBeakleyFormerShushAgent],
//     });
//
//     Const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     TargetCharacter.updateCardDamage(1, "add");
//
//     Expect(targetCharacter.damage).toBe(1);
//
//     Await testEngine.playCard(gurgiAppleLover);
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Should remove only 1 damage (all remaining damage)
//     Expect(targetCharacter.damage).toBe(0);
//   });
//
//   It("HAPPY DAY - ability is optional (may)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gurgiAppleLover.cost,
//       Hand: [gurgiAppleLover],
//       Play: [mrsBeakleyFormerShushAgent],
//     });
//
//     Const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     TargetCharacter.updateCardDamage(2, "add");
//
//     Await testEngine.playCard(gurgiAppleLover);
//
//     // Decline the optional ability
//     Await testEngine.skipTopOfStack();
//
//     // Damage should remain unchanged
//     Expect(targetCharacter.damage).toBe(2);
//   });
//
//   It("HAPPY DAY - can target characters in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gurgiAppleLover.cost * 2,
//       Hand: [gurgiAppleLover],
//       Play: [mrsBeakleyFormerShushAgent],
//     });
//
//     Const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     TargetCharacter.updateCardDamage(2, "add");
//
//     Expect(targetCharacter.damage).toBe(2);
//
//     Await testEngine.playCard(gurgiAppleLover);
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     Expect(targetCharacter.damage).toBe(0);
//   });
//
//   It("HAPPY DAY - has no effect on undamaged character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gurgiAppleLover.cost,
//       Hand: [gurgiAppleLover],
//       Play: [mrsBeakleyFormerShushAgent],
//     });
//
//     Const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//
//     Expect(targetCharacter.damage).toBe(0);
//
//     Await testEngine.playCard(gurgiAppleLover);
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Should still be 0 damage
//     Expect(targetCharacter.damage).toBe(0);
//   });
//
//   It("HAPPY DAY - works when character has exactly 2 damage", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gurgiAppleLover.cost,
//       Hand: [gurgiAppleLover],
//       Play: [mrsBeakleyFormerShushAgent],
//     });
//
//     Const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     TargetCharacter.updateCardDamage(2, "add");
//
//     Expect(targetCharacter.damage).toBe(2);
//
//     Await testEngine.playCard(gurgiAppleLover);
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Should remove all 2 damage
//     Expect(targetCharacter.damage).toBe(0);
//   });
// });
//
