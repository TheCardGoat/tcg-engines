// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mulanInjuredSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { herculesMightyLeader } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mulan - Injured Soldier", () => {
//   it("**BLESSURE AU COMBAT** This character enters play with 2 damage.", () => {
//     const testStore = new TestStore({
//       inkwell: mulanInjuredSoldier.cost,
//       hand: [mulanInjuredSoldier],
//     });
//
//     const cardUnderTest = testStore.getCard(mulanInjuredSoldier);
//
//     cardUnderTest.playFromHand();
//
//     expect(cardUnderTest.damage).toEqual(2);
//   });
// });
//
// describe("Regression", () => {
//   it("Mulan + Hercules interaction", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mulanInjuredSoldier.cost,
//       hand: [mulanInjuredSoldier],
//       play: [herculesMightyLeader],
//     });
//
//     await testEngine.exertCard(herculesMightyLeader);
//     await testEngine.playCard(mulanInjuredSoldier);
//
//     expect(testEngine.getCardModel(mulanInjuredSoldier).damage).toEqual(2);
//   });
// });
//
