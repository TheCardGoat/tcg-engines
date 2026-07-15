// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { dangHuTalonChief } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dang Hu - Talon Chief", () => {
//   It.skip("**YOU BETTER TALK FAST** Your other Villain characters gain **Support.** _(Whenever they quest, you mad add their {S} to another chosen character's {S} this turn.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: dangHuTalonChief.cost,
//       Play: [dangHuTalonChief],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", dangHuTalonChief.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
