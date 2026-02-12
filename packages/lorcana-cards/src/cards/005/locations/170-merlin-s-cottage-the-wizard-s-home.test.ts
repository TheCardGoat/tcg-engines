// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { merlinsCottageTheWizardsHome } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin's Cottage - The Wizard's Home", () => {
//   It.skip("**KNOWLEDGE IS POWER** Each player plays with the top card of their deck face up.", () => {
//     Const testStore = new TestStore({
//       Inkwell: merlinsCottageTheWizardsHome.cost,
//       Play: [merlinsCottageTheWizardsHome],
//     });
//
//     Const cardUnderTest = testStore.getCard(merlinsCottageTheWizardsHome);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
