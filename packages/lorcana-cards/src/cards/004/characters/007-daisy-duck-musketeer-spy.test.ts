// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { daisyDuckMusketeerSpy } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Daisy Duck - Musketeer Spy", () => {
//   It.skip("**INFILTRATION** When you play this character, each opponent chooses and discards a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: daisyDuckMusketeerSpy.cost,
//       Hand: [daisyDuckMusketeerSpy],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       DaisyDuckMusketeerSpy.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
