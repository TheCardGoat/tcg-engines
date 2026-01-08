// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { edLaughingHyena } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ed - Laughing Hyena", () => {
//   it.skip("**CAUSE A PANIC** When you play this character, you may deal 2 damage to chosen damaged character.", () => {
//     const testStore = new TestStore({
//       inkwell: edLaughingHyena.cost,
//       hand: [edLaughingHyena],
//     });
//
//     const cardUnderTest = testStore.getCard(edLaughingHyena);
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
