// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { edHystericalPartygoer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ed - Hysterical Partygoer", () => {
//   It.skip("**ROWDY GUEST** Damaged characters can’t challenge this character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: edHystericalPartygoer.cost,
//       Play: [edHystericalPartygoer],
//     });
//
//     Const cardUnderTest = testStore.getCard(edHystericalPartygoer);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
