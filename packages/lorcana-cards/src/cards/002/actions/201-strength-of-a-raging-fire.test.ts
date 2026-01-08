// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   liloMakingAWish,
//   stichtNewDog,
//   tiggerWonderfulThing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { strengthOfARagingFire } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Strength of a Raging Fire", () => {
//   it("Deal damage to chosen character equal to the number of characters you have in play.", () => {
//     const testStore = new TestStore({
//       inkwell: strengthOfARagingFire.cost,
//       hand: [strengthOfARagingFire],
//       play: [
//         goofyKnightForADay,
//         liloMakingAWish,
//         stichtNewDog,
//         tiggerWonderfulThing,
//       ],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       strengthOfARagingFire.id,
//     );
//     const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.meta.damage).toEqual(4);
//   });
// });
//
