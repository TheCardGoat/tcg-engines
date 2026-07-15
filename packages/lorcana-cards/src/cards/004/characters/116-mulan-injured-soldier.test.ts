// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mulanInjuredSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { herculesMightyLeader } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mulan - Injured Soldier", () => {
//   It("**BLESSURE AU COMBAT** This character enters play with 2 damage.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mulanInjuredSoldier.cost,
//       Hand: [mulanInjuredSoldier],
//     });
//
//     Const cardUnderTest = testStore.getCard(mulanInjuredSoldier);
//
//     CardUnderTest.playFromHand();
//
//     Expect(cardUnderTest.damage).toEqual(2);
//   });
// });
//
// Describe("Regression", () => {
//   It("Mulan + Hercules interaction", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mulanInjuredSoldier.cost,
//       Hand: [mulanInjuredSoldier],
//       Play: [herculesMightyLeader],
//     });
//
//     Await testEngine.exertCard(herculesMightyLeader);
//     Await testEngine.playCard(mulanInjuredSoldier);
//
//     Expect(testEngine.getCardModel(mulanInjuredSoldier).damage).toEqual(2);
//   });
// });
//
