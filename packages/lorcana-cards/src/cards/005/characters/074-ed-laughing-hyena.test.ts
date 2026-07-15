// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { edLaughingHyena } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ed - Laughing Hyena", () => {
//   It.skip("**CAUSE A PANIC** When you play this character, you may deal 2 damage to chosen damaged character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: edLaughingHyena.cost,
//       Hand: [edLaughingHyena],
//     });
//
//     Const cardUnderTest = testStore.getCard(edLaughingHyena);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
