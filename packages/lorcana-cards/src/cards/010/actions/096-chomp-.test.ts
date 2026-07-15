// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseTrueFriend,
//   RapunzelGiftedWithHealing,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { chomp } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chomp!", () => {
//   It("deals 2 damage to a chosen damaged character", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chomp.cost,
//         Hand: [chomp],
//         Play: [goofyKnightForADay],
//       },
//       {
//         Play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Add 1 damage to opponent's character to make it damaged
//     Await testEngine.setCardDamage(mickeyMouseTrueFriend, 1);
//
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(1);
//
//     // Play Chomp! and target the damaged character
//     Await testEngine.playCard(chomp);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//     // Character should be banished due to lethal damage (3 total damage exceeds willpower)
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("discard");
//     // Chomp! should go to discard after use
//     Expect(testEngine.getCardModel(chomp).zone).toBe("discard");
//   });
//
//   It("can target damaged friendly characters", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: chomp.cost,
//       Hand: [chomp],
//       Play: [goofyKnightForADay],
//     });
//
//     // Add 1 damage to friendly character
//     Await testEngine.setCardDamage(goofyKnightForADay, 1);
//
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1);
//
//     // Play Chomp! and target the damaged friendly character
//     Await testEngine.playCard(chomp);
//     Await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//
//     // Character should have 3 total damage (1 existing + 2 from Chomp!)
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(3);
//   });
//
//   It("cannot target undamaged characters", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chomp.cost,
//         Hand: [chomp],
//         Play: [goofyKnightForADay],
//       },
//       {
//         Play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Both characters are undamaged
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(0);
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(0);
//
//     // Play Chomp! - there should be no valid targets
//     Await testEngine.playCard(chomp);
//
//     // The action should not be able to resolve without valid targets
//     // (This test verifies the targeting filter works correctly)
//     Expect(testEngine.getCardModel(chomp).zone).toBe("discard");
//   });
//
//   It("can banish character if damage exceeds willpower", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chomp.cost,
//         Hand: [chomp],
//       },
//       {
//         Play: [stichtNewDog], // Stitch has 2 willpower
//       },
//     );
//
//     // Add 1 damage to Stitch (so 2 more will reach 3 total, exceeding 2 willpower)
//     Await testEngine.setCardDamage(stichtNewDog, 1);
//
//     Expect(testEngine.getCardModel(stichtNewDog).damage).toBe(1);
//     Expect(testEngine.getCardModel(stichtNewDog).zone).toBe("play");
//
//     // Play Chomp! and target Stitch
//     Await testEngine.playCard(chomp);
//     Await testEngine.resolveTopOfStack({ targets: [stichtNewDog] });
//
//     // Stitch should be banished due to lethal damage (3 total > 2 willpower)
//     Expect(testEngine.getCardModel(stichtNewDog).zone).toBe("discard");
//   });
//
//   It("works when multiple characters are damaged", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chomp.cost,
//         Hand: [chomp],
//         Play: [goofyKnightForADay, rapunzelGiftedWithHealing],
//       },
//       {
//         Play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Add damage to multiple characters
//     Await testEngine.setCardDamage(goofyKnightForADay, 1);
//     Await testEngine.setCardDamage(rapunzelGiftedWithHealing, 2);
//     Await testEngine.setCardDamage(mickeyMouseTrueFriend, 1);
//
//     // Verify initial damage state
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1);
//     Expect(testEngine.getCardModel(rapunzelGiftedWithHealing).damage).toBe(2);
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(1);
//
//     // Play Chomp! and target one of the damaged characters
//     Await testEngine.playCard(chomp);
//     Await testEngine.resolveTopOfStack({
//       Targets: [rapunzelGiftedWithHealing],
//     });
//
//     // Only the targeted character should receive additional damage
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1); // unchanged
//     Expect(testEngine.getCardModel(rapunzelGiftedWithHealing).damage).toBe(4); // 2 + 2
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(1); // unchanged
//   });
//
//   It("requires exactly 1 damage on character to be valid target", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chomp.cost,
//         Hand: [chomp],
//         Play: [goofyKnightForADay],
//       },
//       {
//         Play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Add damage to make both characters damaged (but not lethal)
//     Await testEngine.setCardDamage(goofyKnightForADay, 1);
//     Await testEngine.setCardDamage(mickeyMouseTrueFriend, 2); // 2 damage < 3 willpower
//
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1);
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(2);
//
//     // Play Chomp! and target character with 2 damage
//     Await testEngine.playCard(chomp);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//     // Character should be banished due to lethal damage (4 total damage exceeds 3 willpower)
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("discard");
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1); // unchanged
//   });
// });
//
