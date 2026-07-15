// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BashfulHopelessRomantic,
//   HappyGoodNatured,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bashful - Hopeless Romantic", () => {
//   It("**OH, GOSH** This character can't quest unless you have another Seven Dwarfs character in play.", () => {
//     Const testStore = new TestStore({
//       Inkwell: happyGoodNatured.cost,
//       Hand: [happyGoodNatured],
//       Play: [bashfulHopelessRomantic],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       BashfulHopelessRomantic.id,
//     );
//     Const dwarf = testStore.getByZoneAndId("hand", happyGoodNatured.id);
//
//     Expect(cardUnderTest.hasQuestRestriction).toEqual(true);
//     Dwarf.playFromHand();
//     Expect(cardUnderTest.hasQuestRestriction).toEqual(false);
//   });
// });
//
