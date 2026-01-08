// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   liloMakingAWish,
//   peterPanNeverLanding,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { lantern } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Lantern", () => {
//   describe("Birthday Lights - You pay 1 {I} less for the next character you play this turn.", () => {
//     it("First character gets a discount.", () => {
//       const testStore = new TestStore({
//         inkwell: 0, // Lilo costs 0 and peter pan costs 3
//         hand: [liloMakingAWish],
//         play: [lantern],
//       });
//
//       const reducedCostChar = testStore.getByZoneAndId(
//         "hand",
//         liloMakingAWish.id,
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId("play", lantern.id);
//       cardUnderTest.activate();
//
//       reducedCostChar.playFromHand();
//
//       expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//       expect(reducedCostChar.zone).toEqual("play");
//     });
//
//     it("Second Character doesn't get a discount", () => {
//       const testStore = new TestStore({
//         inkwell: 3, // Lilo costs 0 and peter pan costs 3
//         hand: [peterPanNeverLanding, liloMakingAWish],
//         play: [lantern],
//       });
//
//       const reducedCostChar = testStore.getByZoneAndId(
//         "hand",
//         liloMakingAWish.id,
//       );
//       const normalCost = testStore.getByZoneAndId(
//         "hand",
//         peterPanNeverLanding.id,
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId("play", lantern.id);
//       cardUnderTest.activate();
//
//       reducedCostChar.playFromHand();
//
//       expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(3);
//       expect(reducedCostChar.zone).toEqual("play");
//
//       normalCost.playFromHand();
//
//       expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//       expect(reducedCostChar.zone).toEqual("play");
//     });
//
//     it.skip("shift", () => {
//       expect(1).toEqual(2);
//     });
//     it.skip("shift second", () => {
//       expect(1).toEqual(2);
//     });
//   });
//
//   describe("Bug: Cost reduction incorrectly applied to activated ability costs", () => {
//     it("Lantern cost reduction should NOT apply to Dumbo activated ability ink cost", async () => {
//       const { dumboNinthWonderOfTheUniverse } = await import(
//         "@lorcanito/lorcana-engine/cards/009"
//       );
//       const { dumboTheFlyingElephant } = await import(
//         "@lorcanito/lorcana-engine/cards/009"
//       );
//       const { monstroWhaleOfAWhale } = await import(
//         "@lorcanito/lorcana-engine/cards/005/characters/052-monstro-whale-of-a-whale"
//       );
//       const { TestEngine } = await import(
//         "@lorcanito/lorcana-engine/rules/testEngine"
//       );
//
//       // Setup: 6 ink, 2 lanterns, 2 Dumbos (The Flying Elephant), 1 Dumbo (Ninth Wonder), Monstro in hand
//       const testEngine = new TestEngine({
//         inkwell: 6,
//         play: [
//           lantern,
//           lantern, // 2 lanterns
//           dumboNinthWonderOfTheUniverse, // Grants ability to other Evasive characters
//           dumboTheFlyingElephant, // Has Evasive, gains the ability
//           dumboTheFlyingElephant, // Second one, also has Evasive
//         ],
//         hand: [monstroWhaleOfAWhale], // Cost 5
//         deck: 10,
//       });
//
//       const lantern1 = testEngine.getCardModel(lantern, 0);
//       const dumbo1 = testEngine.getCardModel(dumboTheFlyingElephant, 0);
//       const dumbo2 = testEngine.getCardModel(dumboTheFlyingElephant, 1);
//       const monstro = testEngine.getCardModel(monstroWhaleOfAWhale);
//
//       // Verify initial state
//       expect(testEngine.getAvailableInkwellCardCount()).toBe(6);
//
//       // Activate Lantern's effect (should create cost reduction for next character)
//       await testEngine.activateCard(lantern1);
//
//       // Verify Dumbo has the gained ability (from Ninth Wonder of the Universe)
//       expect(dumbo1.activatedAbilities.length).toBeGreaterThan(0);
//       const dumboAbility = dumbo1.activatedAbilities.find(
//         (a) => a.name === "MAKING HISTORY",
//       );
//       expect(dumboAbility).toBeDefined();
//
//       // Try to activate Dumbo's ability - should cost 1 ink
//       // BUG: Currently applies Lantern's cost reduction, making it free
//       const inkBeforeDumbo1 = testEngine.getAvailableInkwellCardCount();
//       await testEngine.activateCard(dumbo1, { ability: "MAKING HISTORY" });
//       const inkAfterDumbo1 = testEngine.getAvailableInkwellCardCount();
//
//       // Should have paid 1 ink (exert + 1 ink cost)
//       // BUG: Currently pays 0 ink because Lantern reduction is incorrectly applied
//       expect(inkBeforeDumbo1 - inkAfterDumbo1).toBe(1);
//
//       // Activate second Dumbo's ability - should also cost 1 ink
//       // BUG: Currently also free because Lantern reduction isn't consumed
//       const inkBeforeDumbo2 = testEngine.getAvailableInkwellCardCount();
//       await testEngine.activateCard(dumbo2, { ability: "MAKING HISTORY" });
//       const inkAfterDumbo2 = testEngine.getAvailableInkwellCardCount();
//
//       // Should have paid another 1 ink
//       // BUG: Currently pays 0 ink
//       expect(inkBeforeDumbo2 - inkAfterDumbo2).toBe(1);
//
//       // Now try to play Monstro - should cost 5, but with Lantern reduction should cost 4
//       // BUG: Lantern reduction should have been consumed, but it's still available
//       const inkBeforeMonstro = testEngine.getAvailableInkwellCardCount();
//       testEngine.playCard(monstro);
//       const inkAfterMonstro = testEngine.getAvailableInkwellCardCount();
//
//       // Should have paid 4 ink (5 - 1 from Lantern)
//       // BUG: Currently still pays 4 because reduction wasn't consumed by Dumbo abilities
//       expect(inkBeforeMonstro - inkAfterMonstro).toBe(4);
//
//       // Total ink spent should be: 1 (dumbo1) + 1 (dumbo2) + 4 (monstro) = 6
//       // BUG: Currently spends less because Dumbo abilities are free
//       expect(testEngine.getAvailableInkwellCardCount()).toBe(0);
//     });
//   });
// });
//
