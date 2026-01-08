// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { panicImmortalSidekick } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Panic - Immortal Sidekick", () => {
//   it.skip("**REPORTING FOR DUTY** While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.", () => {
//     const testStore = new TestStore({
//       inkwell: panicImmortalSidekick.cost,
//       play: [panicImmortalSidekick],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       panicImmortalSidekick.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
