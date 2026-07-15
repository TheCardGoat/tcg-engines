// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   PeterPanNeverLanding,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { lantern } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lantern", () => {
//   Describe("Birthday Lights - You pay 1 {I} less for the next character you play this turn.", () => {
//     It("First character gets a discount.", () => {
//       Const testStore = new TestStore({
//         Inkwell: 0, // Lilo costs 0 and peter pan costs 3
//         Hand: [liloMakingAWish],
//         Play: [lantern],
//       });
//
//       Const reducedCostChar = testStore.getByZoneAndId(
//         "hand",
//         LiloMakingAWish.id,
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", lantern.id);
//       CardUnderTest.activate();
//
//       ReducedCostChar.playFromHand();
//
//       Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//       Expect(reducedCostChar.zone).toEqual("play");
//     });
//
//     It("Second Character doesn't get a discount", () => {
//       Const testStore = new TestStore({
//         Inkwell: 3, // Lilo costs 0 and peter pan costs 3
//         Hand: [peterPanNeverLanding, liloMakingAWish],
//         Play: [lantern],
//       });
//
//       Const reducedCostChar = testStore.getByZoneAndId(
//         "hand",
//         LiloMakingAWish.id,
//       );
//       Const normalCost = testStore.getByZoneAndId(
//         "hand",
//         PeterPanNeverLanding.id,
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", lantern.id);
//       CardUnderTest.activate();
//
//       ReducedCostChar.playFromHand();
//
//       Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(3);
//       Expect(reducedCostChar.zone).toEqual("play");
//
//       NormalCost.playFromHand();
//
//       Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//       Expect(reducedCostChar.zone).toEqual("play");
//     });
//
//     It.skip("shift", () => {
//       Expect(1).toEqual(2);
//     });
//     It.skip("shift second", () => {
//       Expect(1).toEqual(2);
//     });
//   });
//
//   Describe("Bug: Cost reduction incorrectly applied to activated ability costs", () => {
//     It("Lantern cost reduction should NOT apply to Dumbo activated ability ink cost", async () => {
//       Const { dumboNinthWonderOfTheUniverse } = await import(
//         "@lorcanito/lorcana-engine/cards/009"
//       );
//       Const { dumboTheFlyingElephant } = await import(
//         "@lorcanito/lorcana-engine/cards/009"
//       );
//       Const { monstroWhaleOfAWhale } = await import(
//         "@lorcanito/lorcana-engine/cards/005/characters/052-monstro-whale-of-a-whale"
//       );
//       Const { TestEngine } = await import(
//         "@lorcanito/lorcana-engine/rules/testEngine"
//       );
//
//       // Setup: 6 ink, 2 lanterns, 2 Dumbos (The Flying Elephant), 1 Dumbo (Ninth Wonder), Monstro in hand
//       Const testEngine = new TestEngine({
//         Inkwell: 6,
//         Play: [
//           Lantern,
//           Lantern, // 2 lanterns
//           DumboNinthWonderOfTheUniverse, // Grants ability to other Evasive characters
//           DumboTheFlyingElephant, // Has Evasive, gains the ability
//           DumboTheFlyingElephant, // Second one, also has Evasive
//         ],
//         Hand: [monstroWhaleOfAWhale], // Cost 5
//         Deck: 10,
//       });
//
//       Const lantern1 = testEngine.getCardModel(lantern, 0);
//       Const dumbo1 = testEngine.getCardModel(dumboTheFlyingElephant, 0);
//       Const dumbo2 = testEngine.getCardModel(dumboTheFlyingElephant, 1);
//       Const monstro = testEngine.getCardModel(monstroWhaleOfAWhale);
//
//       // Verify initial state
//       Expect(testEngine.getAvailableInkwellCardCount()).toBe(6);
//
//       // Activate Lantern's effect (should create cost reduction for next character)
//       Await testEngine.activateCard(lantern1);
//
//       // Verify Dumbo has the gained ability (from Ninth Wonder of the Universe)
//       Expect(dumbo1.activatedAbilities.length).toBeGreaterThan(0);
//       Const dumboAbility = dumbo1.activatedAbilities.find(
//         (a) => a.name === "MAKING HISTORY",
//       );
//       Expect(dumboAbility).toBeDefined();
//
//       // Try to activate Dumbo's ability - should cost 1 ink
//       // BUG: Currently applies Lantern's cost reduction, making it free
//       Const inkBeforeDumbo1 = testEngine.getAvailableInkwellCardCount();
//       Await testEngine.activateCard(dumbo1, { ability: "MAKING HISTORY" });
//       Const inkAfterDumbo1 = testEngine.getAvailableInkwellCardCount();
//
//       // Should have paid 1 ink (exert + 1 ink cost)
//       // BUG: Currently pays 0 ink because Lantern reduction is incorrectly applied
//       Expect(inkBeforeDumbo1 - inkAfterDumbo1).toBe(1);
//
//       // Activate second Dumbo's ability - should also cost 1 ink
//       // BUG: Currently also free because Lantern reduction isn't consumed
//       Const inkBeforeDumbo2 = testEngine.getAvailableInkwellCardCount();
//       Await testEngine.activateCard(dumbo2, { ability: "MAKING HISTORY" });
//       Const inkAfterDumbo2 = testEngine.getAvailableInkwellCardCount();
//
//       // Should have paid another 1 ink
//       // BUG: Currently pays 0 ink
//       Expect(inkBeforeDumbo2 - inkAfterDumbo2).toBe(1);
//
//       // Now try to play Monstro - should cost 5, but with Lantern reduction should cost 4
//       // BUG: Lantern reduction should have been consumed, but it's still available
//       Const inkBeforeMonstro = testEngine.getAvailableInkwellCardCount();
//       TestEngine.playCard(monstro);
//       Const inkAfterMonstro = testEngine.getAvailableInkwellCardCount();
//
//       // Should have paid 4 ink (5 - 1 from Lantern)
//       // BUG: Currently still pays 4 because reduction wasn't consumed by Dumbo abilities
//       Expect(inkBeforeMonstro - inkAfterMonstro).toBe(4);
//
//       // Total ink spent should be: 1 (dumbo1) + 1 (dumbo2) + 4 (monstro) = 6
//       // BUG: Currently spends less because Dumbo abilities are free
//       Expect(testEngine.getAvailableInkwellCardCount()).toBe(0);
//     });
//   });
// });
//
