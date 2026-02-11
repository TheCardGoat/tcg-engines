// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { doItAgain } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   LadyTremaine,
//   ScarShamelessFirebrand,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lady Tremaine", () => {
//   It("DO IT AGAIN effect - returning own item", () => {
//     Const testStore = new TestStore({
//       Inkwell: ladyTremaine.cost,
//       Hand: [ladyTremaine],
//       Discard: [doItAgain],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ladyTremaine.id);
//     Const target = testStore.getByZoneAndId("discard", doItAgain.id);
//     Expect(target.zone).toEqual("discard");
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({
//       Targets: [target],
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 1 }),
//     );
//   });
//
//   It("DO IT AGAIN effect - no valid target", () => {
//     Const testStore = new TestStore({
//       Inkwell: ladyTremaine.cost,
//       Hand: [ladyTremaine],
//       Discard: [scarShamelessFirebrand],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ladyTremaine.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     TestStore.resolveTopOfStack();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 0, discard: 1, play: 1 }),
//     );
//   });
// });
//
