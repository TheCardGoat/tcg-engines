// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jasmineDesertWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jasmine - Desert Warrior", () => {
//   It.skip("**SMART MANEUVER** When you play this character and each time she is challenged, each opponent chooses and discards a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: jasmineDesertWarrior.cost,
//       Hand: [jasmineDesertWarrior],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       JasmineDesertWarrior.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
