// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { bernardBrandNewAgent } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Bernard - Brand-New Agent", () => {
//   it.skip("**I’LL CHECK IT OUT** At the end of your turn, if this character is exerted, you may ready another chosen character of yours.", () => {
//     const testStore = new TestStore({
//       inkwell: bernardBrandNewAgent.cost,
//       play: [bernardBrandNewAgent],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       bernardBrandNewAgent.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
