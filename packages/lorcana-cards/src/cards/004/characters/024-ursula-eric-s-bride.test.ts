// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { ursulaEricsBride } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula - Eric's Bride", () => {
//   It.skip("**Shift: Discard a song card** _(You may discard a song card to play this on top of one of your characters named Ursula.)_**VANESSA'S DESIGN** Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.", () => {
//     Const testStore = new TestStore({
//       Inkwell: ursulaEricsBride.cost,
//       Play: [ursulaEricsBride],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", ursulaEricsBride.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
