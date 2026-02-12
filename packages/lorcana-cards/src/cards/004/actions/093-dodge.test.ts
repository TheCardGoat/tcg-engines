// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dodge } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dodge!", () => {
//   It("Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: dodge.cost,
//       Hand: [dodge],
//       Play: [mickeyBraveLittleTailor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", dodge.id);
//     Const targetCharacter = testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // Dodge! goes to discard
//   });
// });
//
