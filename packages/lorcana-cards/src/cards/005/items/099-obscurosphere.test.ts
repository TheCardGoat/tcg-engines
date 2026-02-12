// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { obscurosphere } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Obscurosphere", () => {
//   It.skip("**EXTRACT OF EMERALD** 2 {I}, Banish this item – Your characters gain **Ward** until the start of your next turn. _(Opponents can't choose them except to challenge.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: obscurosphere.cost,
//       Play: [obscurosphere],
//     });
//
//     Const cardUnderTest = testStore.getCard(obscurosphere);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
