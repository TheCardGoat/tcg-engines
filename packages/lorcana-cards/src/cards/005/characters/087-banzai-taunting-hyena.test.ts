// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BanzaiTauntingHyena,
//   MonstroWhaleOfAWhale,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Banzai - Taunting Hyena", () => {
//   It("**HERE KITTY, KITTY, KITTY** When you play this character, you may exert chosen damaged character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: banzaiTauntingHyena.cost,
//       Hand: [banzaiTauntingHyena],
//       Play: [monstroWhaleOfAWhale],
//     });
//
//     Const cardUnderTest = testStore.getCard(banzaiTauntingHyena);
//     Const target = testStore.getCard(monstroWhaleOfAWhale);
//     Target.updateCardMeta({ damage: 2 });
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.exerted).toEqual(true);
//   });
// });
//
