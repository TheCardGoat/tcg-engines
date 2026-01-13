// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   gurgiAppleLover,
//   mrsBeakleyFormerShushAgent,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gurgi - Apple Lover", () => {
//   it("HAPPY DAY - triggers when you play this character", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gurgiAppleLover.cost,
//       hand: [gurgiAppleLover],
//       play: [mrsBeakleyFormerShushAgent],
//     });
//
//     const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     targetCharacter.updateCardDamage(2, "add");
//
//     expect(targetCharacter.damage).toBe(2);
//
//     await testEngine.playCard(gurgiAppleLover);
//
//     expect(testEngine.getCardModel(gurgiAppleLover).zone).toBe("play");
//     expect(testEngine.store.stackLayerStore.layers.length).toBe(1);
//   });
//
//   it("HAPPY DAY - removes up to 2 damage from chosen character", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gurgiAppleLover.cost,
//       hand: [gurgiAppleLover],
//       play: [mrsBeakleyFormerShushAgent],
//     });
//
//     const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     targetCharacter.updateCardDamage(3, "add");
//
//     expect(targetCharacter.damage).toBe(3);
//
//     await testEngine.playCard(gurgiAppleLover);
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Should remove 2 damage, leaving 1 damage
//     expect(targetCharacter.damage).toBe(1);
//   });
//
//   it("HAPPY DAY - removes exactly the remaining damage if less than 2", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gurgiAppleLover.cost,
//       hand: [gurgiAppleLover],
//       play: [mrsBeakleyFormerShushAgent],
//     });
//
//     const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     targetCharacter.updateCardDamage(1, "add");
//
//     expect(targetCharacter.damage).toBe(1);
//
//     await testEngine.playCard(gurgiAppleLover);
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Should remove only 1 damage (all remaining damage)
//     expect(targetCharacter.damage).toBe(0);
//   });
//
//   it("HAPPY DAY - ability is optional (may)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gurgiAppleLover.cost,
//       hand: [gurgiAppleLover],
//       play: [mrsBeakleyFormerShushAgent],
//     });
//
//     const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     targetCharacter.updateCardDamage(2, "add");
//
//     await testEngine.playCard(gurgiAppleLover);
//
//     // Decline the optional ability
//     await testEngine.skipTopOfStack();
//
//     // Damage should remain unchanged
//     expect(targetCharacter.damage).toBe(2);
//   });
//
//   it("HAPPY DAY - can target characters in play", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gurgiAppleLover.cost * 2,
//       hand: [gurgiAppleLover],
//       play: [mrsBeakleyFormerShushAgent],
//     });
//
//     const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     targetCharacter.updateCardDamage(2, "add");
//
//     expect(targetCharacter.damage).toBe(2);
//
//     await testEngine.playCard(gurgiAppleLover);
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     expect(targetCharacter.damage).toBe(0);
//   });
//
//   it("HAPPY DAY - has no effect on undamaged character", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gurgiAppleLover.cost,
//       hand: [gurgiAppleLover],
//       play: [mrsBeakleyFormerShushAgent],
//     });
//
//     const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//
//     expect(targetCharacter.damage).toBe(0);
//
//     await testEngine.playCard(gurgiAppleLover);
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Should still be 0 damage
//     expect(targetCharacter.damage).toBe(0);
//   });
//
//   it("HAPPY DAY - works when character has exactly 2 damage", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gurgiAppleLover.cost,
//       hand: [gurgiAppleLover],
//       play: [mrsBeakleyFormerShushAgent],
//     });
//
//     const targetCharacter = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     targetCharacter.updateCardDamage(2, "add");
//
//     expect(targetCharacter.damage).toBe(2);
//
//     await testEngine.playCard(gurgiAppleLover);
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Should remove all 2 damage
//     expect(targetCharacter.damage).toBe(0);
//   });
// });
//
