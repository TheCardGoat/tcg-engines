// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { youCanFly } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("You Can Fly", () => {
//   It("Chosen character gains **Evasive** until the start of your next turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: youCanFly.cost,
//       Hand: [youCanFly],
//       Play: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", youCanFly.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     Expect(target.hasEvasive).toBe(false);
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.hasEvasive).toBe(true);
//   });
// });
//
