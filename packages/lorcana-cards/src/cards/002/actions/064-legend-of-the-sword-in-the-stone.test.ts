// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { legendOfTheSwordInTheStone } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Legend of the Sword in the Stone", () => {
//   It("Chosen character gains **Challenger** +3 this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: legendOfTheSwordInTheStone.cost,
//         Hand: [legendOfTheSwordInTheStone],
//         Play: [goofyKnightForADay],
//       },
//       {
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       LegendOfTheSwordInTheStone.id,
//     );
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.hasChallenger).toBe(true);
//
//     TestStore.passTurn();
//
//     Expect(target.hasChallenger).toBe(false);
//   });
// });
//
