// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { beastWounded } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Beast - Wounded", () => {
//   it("**THAT HURTS!** This character enters play with 4 damage.", () => {
//     const testStore = new TestStore({
//       inkwell: beastWounded.cost,
//       hand: [beastWounded],
//     });
//
//     const cardUnderTest = testStore.getCard(beastWounded);
//
//     cardUnderTest.playFromHand();
//     expect(cardUnderTest.damage).toEqual(4);
//   });
// });
//
