// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   bashfulHopelessRomantic,
//   happyGoodNatured,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Bashful - Hopeless Romantic", () => {
//   it("**OH, GOSH** This character can't quest unless you have another Seven Dwarfs character in play.", () => {
//     const testStore = new TestStore({
//       inkwell: happyGoodNatured.cost,
//       hand: [happyGoodNatured],
//       play: [bashfulHopelessRomantic],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       bashfulHopelessRomantic.id,
//     );
//     const dwarf = testStore.getByZoneAndId("hand", happyGoodNatured.id);
//
//     expect(cardUnderTest.hasQuestRestriction).toEqual(true);
//     dwarf.playFromHand();
//     expect(cardUnderTest.hasQuestRestriction).toEqual(false);
//   });
// });
//
