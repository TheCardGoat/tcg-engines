// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { bruniFireSalamander } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bruni - Fire Salamander", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: bruniFireSalamander.cost,
//       Play: [bruniFireSalamander],
//     });
//
//     Const cardUnderTest = testStore.getCard(bruniFireSalamander);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**PARTING GIFT** When this character is banished, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: bruniFireSalamander.cost,
//       Play: [bruniFireSalamander],
//     });
//
//     Const cardUnderTest = testStore.getCard(bruniFireSalamander);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
