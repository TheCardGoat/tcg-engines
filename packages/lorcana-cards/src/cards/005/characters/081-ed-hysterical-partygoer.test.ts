// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { edHystericalPartygoer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ed - Hysterical Partygoer", () => {
//   it.skip("**ROWDY GUEST** Damaged characters can’t challenge this character.", () => {
//     const testStore = new TestStore({
//       inkwell: edHystericalPartygoer.cost,
//       play: [edHystericalPartygoer],
//     });
//
//     const cardUnderTest = testStore.getCard(edHystericalPartygoer);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
