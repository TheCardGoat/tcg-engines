// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { jetsamOpportunisticEel } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jetsam - Opportunistic Eel", () => {
//   Describe("AMBUSH FROM THE DEEP - Basic Functionality", () => {
//     It("deals 3 damage to chosen opposing damaged character when played", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: jetsamOpportunisticEel.cost,
//           Hand: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [jetsamOpportunisticEel], // 6 willpower character
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel, 0);
//       Const target = testEngine.getCardModel(jetsamOpportunisticEel, 1);
//
//       // Damage the target first to make it valid
//       Target.updateCardDamage(1, "add");
//
//       Expect(target.damage).toBe(1);
//       Expect(target.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Should have dealt 3 additional damage (total 4 on 6 willpower)
//       Expect(target.damage).toBe(4);
//       Expect(target.zone).toBe("play");
//     });
//
//     It("deals 3 damage to damaged character without banishing if it survives", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: jetsamOpportunisticEel.cost,
//           Hand: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [jetsamOpportunisticEel], // 6 willpower character
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel, 0);
//       Const target = testEngine.getCardModel(jetsamOpportunisticEel, 1);
//
//       // Damage the target first
//       Target.updateCardDamage(2, "add");
//
//       Expect(target.damage).toBe(2);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Should have dealt 3 additional damage (total 5 damage on 6 willpower)
//       Expect(target.damage).toBe(5);
//       Expect(target.zone).toBe("play");
//     });
//   });
//
//   Describe("AMBUSH FROM THE DEEP - Targeting Restrictions", () => {
//     It("cannot target undamaged characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: jetsamOpportunisticEel.cost,
//           Hand: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [tipoGrowingSon], // Undamaged character
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       Expect(target.damage).toBe(0);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Should not have any ability on stack since no valid targets
//       Expect(target.zone).toBe("play");
//       Expect(target.damage).toBe(0);
//     });
//
//     It("can only target opposing characters, not own damaged characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: jetsamOpportunisticEel.cost,
//         Hand: [jetsamOpportunisticEel],
//         Play: [tipoGrowingSon],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//       Const ownCharacter = testEngine.getCardModel(tipoGrowingSon);
//
//       // Damage own character
//       OwnCharacter.updateCardDamage(1, "add");
//
//       Expect(ownCharacter.damage).toBe(1);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Should not target own characters
//       Expect(ownCharacter.damage).toBe(1);
//       Expect(ownCharacter.zone).toBe("play");
//     });
//
//     It("must be a damaged character to be targeted", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: jetsamOpportunisticEel.cost,
//           Hand: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [tipoGrowingSon],
//         },
//       );
//
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       Expect(target.damage).toBe(0);
//
//       Await testEngine.playCard(jetsamOpportunisticEel);
//
//       // No valid targets, ability should not trigger or resolve without effect
//       Expect(target.damage).toBe(0);
//     });
//   });
//
//   Describe("AMBUSH FROM THE DEEP - Multiple Valid Targets", () => {
//     It("allows player to choose which damaged opposing character to damage", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: jetsamOpportunisticEel.cost,
//           Hand: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [tipoGrowingSon, jetsamOpportunisticEel],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel, 0);
//       Const target1 = testEngine.getCardModel(tipoGrowingSon);
//       Const target2 = testEngine.getCardModel(jetsamOpportunisticEel, 1);
//
//       // Damage both opposing characters
//       Target1.updateCardDamage(1, "add");
//       Target2.updateCardDamage(1, "add");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveTopOfStack({ targets: [target2] });
//
//       // Only the chosen target should take additional damage
//       Expect(target1.damage).toBe(1);
//       Expect(target2.damage).toBe(4);
//     });
//   });
//
//   Describe("AMBUSH FROM THE DEEP - Edge Cases", () => {
//     It("works when opponent has no valid targets", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: jetsamOpportunisticEel.cost,
//           Hand: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [], // No opposing characters
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Should play successfully even with no valid targets
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("can banish character if damage exceeds willpower", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: jetsamOpportunisticEel.cost,
//           Hand: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [tipoGrowingSon], // 1 willpower character
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       // Damage to 1 (will have 4 total after ability, exceeding 1 willpower)
//       Target.updateCardDamage(1, "add");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Should be banished (1 + 3 = 4 damage on 1 willpower)
//       Expect(target.zone).toBe("discard");
//     });
//
//     It("triggers only when Jetsam is played, not when already in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [tipoGrowingSon],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel);
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       Target.updateCardDamage(1, "add");
//
//       // Damage target after Jetsam is already in play
//       Target.updateCardDamage(1, "add");
//
//       // Should not trigger ability since Jetsam was already in play
//       Expect(target.damage).toBe(2);
//     });
//   });
//
//   Describe("AMBUSH FROM THE DEEP - Damage Calculation", () => {
//     It("deals exactly 3 damage", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: jetsamOpportunisticEel.cost,
//           Hand: [jetsamOpportunisticEel],
//         },
//         {
//           Play: [jetsamOpportunisticEel], // 6 willpower
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(jetsamOpportunisticEel, 0);
//       Const target = testEngine.getCardModel(jetsamOpportunisticEel, 1);
//
//       Target.updateCardDamage(1, "add");
//
//       Expect(target.damage).toBe(1);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Should have exactly 4 total damage (1 + 3)
//       Expect(target.damage).toBe(4);
//     });
//   });
// });
//
