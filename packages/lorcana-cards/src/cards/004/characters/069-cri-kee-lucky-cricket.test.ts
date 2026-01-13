// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { criKeeLuckyCricket } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Cri-Kee - Lucky Cricket", () => {
//   it.skip("**SPREADING GOOD FORTUNE** When you play this character, your other characters get +3 {S} this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: criKeeLuckyCricket.cost,
//       hand: [criKeeLuckyCricket],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       criKeeLuckyCricket.id,
//     );
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
