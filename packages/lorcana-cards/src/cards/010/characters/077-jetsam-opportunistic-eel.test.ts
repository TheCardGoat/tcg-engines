// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { jetsamOpportunisticEel } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jetsam - Opportunistic Eel", () => {
//   describe("AMBUSH FROM THE DEEP - Basic Functionality", () => {
//     it("deals 3 damage to chosen opposing damaged character when played", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: jetsamOpportunisticEel.cost,
//           hand: [jetsamOpportunisticEel],
//         },
//         {
//           play: [jetsamOpportunisticEel], // 6 willpower character
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel, 0);
//       const target = testEngine.getCardModel(jetsamOpportunisticEel, 1);
//
//       // Damage the target first to make it valid
//       target.updateCardDamage(1, "add");
//
//       expect(target.damage).toBe(1);
//       expect(target.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Should have dealt 3 additional damage (total 4 on 6 willpower)
//       expect(target.damage).toBe(4);
//       expect(target.zone).toBe("play");
//     });
//
//     it("deals 3 damage to damaged character without banishing if it survives", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: jetsamOpportunisticEel.cost,
//           hand: [jetsamOpportunisticEel],
//         },
//         {
//           play: [jetsamOpportunisticEel], // 6 willpower character
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel, 0);
//       const target = testEngine.getCardModel(jetsamOpportunisticEel, 1);
//
//       // Damage the target first
//       target.updateCardDamage(2, "add");
//
//       expect(target.damage).toBe(2);
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Should have dealt 3 additional damage (total 5 damage on 6 willpower)
//       expect(target.damage).toBe(5);
//       expect(target.zone).toBe("play");
//     });
//   });
//
//   describe("AMBUSH FROM THE DEEP - Targeting Restrictions", () => {
//     it("cannot target undamaged characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: jetsamOpportunisticEel.cost,
//           hand: [jetsamOpportunisticEel],
//         },
//         {
//           play: [tipoGrowingSon], // Undamaged character
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       expect(target.damage).toBe(0);
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Should not have any ability on stack since no valid targets
//       expect(target.zone).toBe("play");
//       expect(target.damage).toBe(0);
//     });
//
//     it("can only target opposing characters, not own damaged characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: jetsamOpportunisticEel.cost,
//         hand: [jetsamOpportunisticEel],
//         play: [tipoGrowingSon],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//       const ownCharacter = testEngine.getCardModel(tipoGrowingSon);
//
//       // Damage own character
//       ownCharacter.updateCardDamage(1, "add");
//
//       expect(ownCharacter.damage).toBe(1);
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Should not target own characters
//       expect(ownCharacter.damage).toBe(1);
//       expect(ownCharacter.zone).toBe("play");
//     });
//
//     it("must be a damaged character to be targeted", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: jetsamOpportunisticEel.cost,
//           hand: [jetsamOpportunisticEel],
//         },
//         {
//           play: [tipoGrowingSon],
//         },
//       );
//
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       expect(target.damage).toBe(0);
//
//       await testEngine.playCard(jetsamOpportunisticEel);
//
//       // No valid targets, ability should not trigger or resolve without effect
//       expect(target.damage).toBe(0);
//     });
//   });
//
//   describe("AMBUSH FROM THE DEEP - Multiple Valid Targets", () => {
//     it("allows player to choose which damaged opposing character to damage", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: jetsamOpportunisticEel.cost,
//           hand: [jetsamOpportunisticEel],
//         },
//         {
//           play: [tipoGrowingSon, jetsamOpportunisticEel],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel, 0);
//       const target1 = testEngine.getCardModel(tipoGrowingSon);
//       const target2 = testEngine.getCardModel(jetsamOpportunisticEel, 1);
//
//       // Damage both opposing characters
//       target1.updateCardDamage(1, "add");
//       target2.updateCardDamage(1, "add");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveTopOfStack({ targets: [target2] });
//
//       // Only the chosen target should take additional damage
//       expect(target1.damage).toBe(1);
//       expect(target2.damage).toBe(4);
//     });
//   });
//
//   describe("AMBUSH FROM THE DEEP - Edge Cases", () => {
//     it("works when opponent has no valid targets", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: jetsamOpportunisticEel.cost,
//           hand: [jetsamOpportunisticEel],
//         },
//         {
//           play: [], // No opposing characters
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Should play successfully even with no valid targets
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("can banish character if damage exceeds willpower", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: jetsamOpportunisticEel.cost,
//           hand: [jetsamOpportunisticEel],
//         },
//         {
//           play: [tipoGrowingSon], // 1 willpower character
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       // Damage to 1 (will have 4 total after ability, exceeding 1 willpower)
//       target.updateCardDamage(1, "add");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Should be banished (1 + 3 = 4 damage on 1 willpower)
//       expect(target.zone).toBe("discard");
//     });
//
//     it("triggers only when Jetsam is played, not when already in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [jetsamOpportunisticEel],
//         },
//         {
//           play: [tipoGrowingSon],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       target.updateCardDamage(1, "add");
//
//       // Damage target after Jetsam is already in play
//       target.updateCardDamage(1, "add");
//
//       // Should not trigger ability since Jetsam was already in play
//       expect(target.damage).toBe(2);
//     });
//   });
//
//   describe("AMBUSH FROM THE DEEP - Damage Calculation", () => {
//     it("deals exactly 3 damage", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: jetsamOpportunisticEel.cost,
//           hand: [jetsamOpportunisticEel],
//         },
//         {
//           play: [jetsamOpportunisticEel], // 6 willpower
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel, 0);
//       const target = testEngine.getCardModel(jetsamOpportunisticEel, 1);
//
//       target.updateCardDamage(1, "add");
//
//       expect(target.damage).toBe(1);
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Should have exactly 4 total damage (1 + 3)
//       expect(target.damage).toBe(4);
//     });
//   });
// });
//
