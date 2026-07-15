// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   StichtNewDog,
//   TiggerWonderfulThing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { strengthOfARagingFire } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Strength of a Raging Fire", () => {
//   It("Deal damage to chosen character equal to the number of characters you have in play.", () => {
//     Const testStore = new TestStore({
//       Inkwell: strengthOfARagingFire.cost,
//       Hand: [strengthOfARagingFire],
//       Play: [
//         GoofyKnightForADay,
//         LiloMakingAWish,
//         StichtNewDog,
//         TiggerWonderfulThing,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       StrengthOfARagingFire.id,
//     );
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(4);
//   });
// });
//
