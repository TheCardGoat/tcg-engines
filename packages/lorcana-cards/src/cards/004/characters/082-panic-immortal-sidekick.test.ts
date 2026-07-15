// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { panicImmortalSidekick } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Panic - Immortal Sidekick", () => {
//   It.skip("**REPORTING FOR DUTY** While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.", () => {
//     Const testStore = new TestStore({
//       Inkwell: panicImmortalSidekick.cost,
//       Play: [panicImmortalSidekick],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PanicImmortalSidekick.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
