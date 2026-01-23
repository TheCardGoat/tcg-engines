// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyMouseTrueFriend,
//   rapunzelGiftedWithHealing,
//   stichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { chomp } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Chomp!", () => {
//   it("deals 2 damage to a chosen damaged character", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: chomp.cost,
//         hand: [chomp],
//         play: [goofyKnightForADay],
//       },
//       {
//         play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Add 1 damage to opponent's character to make it damaged
//     await testEngine.setCardDamage(mickeyMouseTrueFriend, 1);
//
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(1);
//
//     // Play Chomp! and target the damaged character
//     await testEngine.playCard(chomp);
//     await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//     // Character should be banished due to lethal damage (3 total damage exceeds willpower)
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("discard");
//     // Chomp! should go to discard after use
//     expect(testEngine.getCardModel(chomp).zone).toBe("discard");
//   });
//
//   it("can target damaged friendly characters", async () => {
//     const testEngine = new TestEngine({
//       inkwell: chomp.cost,
//       hand: [chomp],
//       play: [goofyKnightForADay],
//     });
//
//     // Add 1 damage to friendly character
//     await testEngine.setCardDamage(goofyKnightForADay, 1);
//
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1);
//
//     // Play Chomp! and target the damaged friendly character
//     await testEngine.playCard(chomp);
//     await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//
//     // Character should have 3 total damage (1 existing + 2 from Chomp!)
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(3);
//   });
//
//   it("cannot target undamaged characters", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: chomp.cost,
//         hand: [chomp],
//         play: [goofyKnightForADay],
//       },
//       {
//         play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Both characters are undamaged
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(0);
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(0);
//
//     // Play Chomp! - there should be no valid targets
//     await testEngine.playCard(chomp);
//
//     // The action should not be able to resolve without valid targets
//     // (This test verifies the targeting filter works correctly)
//     expect(testEngine.getCardModel(chomp).zone).toBe("discard");
//   });
//
//   it("can banish character if damage exceeds willpower", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: chomp.cost,
//         hand: [chomp],
//       },
//       {
//         play: [stichtNewDog], // Stitch has 2 willpower
//       },
//     );
//
//     // Add 1 damage to Stitch (so 2 more will reach 3 total, exceeding 2 willpower)
//     await testEngine.setCardDamage(stichtNewDog, 1);
//
//     expect(testEngine.getCardModel(stichtNewDog).damage).toBe(1);
//     expect(testEngine.getCardModel(stichtNewDog).zone).toBe("play");
//
//     // Play Chomp! and target Stitch
//     await testEngine.playCard(chomp);
//     await testEngine.resolveTopOfStack({ targets: [stichtNewDog] });
//
//     // Stitch should be banished due to lethal damage (3 total > 2 willpower)
//     expect(testEngine.getCardModel(stichtNewDog).zone).toBe("discard");
//   });
//
//   it("works when multiple characters are damaged", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: chomp.cost,
//         hand: [chomp],
//         play: [goofyKnightForADay, rapunzelGiftedWithHealing],
//       },
//       {
//         play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Add damage to multiple characters
//     await testEngine.setCardDamage(goofyKnightForADay, 1);
//     await testEngine.setCardDamage(rapunzelGiftedWithHealing, 2);
//     await testEngine.setCardDamage(mickeyMouseTrueFriend, 1);
//
//     // Verify initial damage state
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1);
//     expect(testEngine.getCardModel(rapunzelGiftedWithHealing).damage).toBe(2);
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(1);
//
//     // Play Chomp! and target one of the damaged characters
//     await testEngine.playCard(chomp);
//     await testEngine.resolveTopOfStack({
//       targets: [rapunzelGiftedWithHealing],
//     });
//
//     // Only the targeted character should receive additional damage
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1); // unchanged
//     expect(testEngine.getCardModel(rapunzelGiftedWithHealing).damage).toBe(4); // 2 + 2
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(1); // unchanged
//   });
//
//   it("requires exactly 1 damage on character to be valid target", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: chomp.cost,
//         hand: [chomp],
//         play: [goofyKnightForADay],
//       },
//       {
//         play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Add damage to make both characters damaged (but not lethal)
//     await testEngine.setCardDamage(goofyKnightForADay, 1);
//     await testEngine.setCardDamage(mickeyMouseTrueFriend, 2); // 2 damage < 3 willpower
//
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1);
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(2);
//
//     // Play Chomp! and target character with 2 damage
//     await testEngine.playCard(chomp);
//     await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//     // Character should be banished due to lethal damage (4 total damage exceeds 3 willpower)
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("discard");
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1); // unchanged
//   });
// });
//
