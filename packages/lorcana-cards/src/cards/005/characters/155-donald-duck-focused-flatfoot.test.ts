// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuckFocusedFlatfoot,
//   TipoGrowingSon,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Focused Flatfoot", () => {
//   It("**BAFFLING MYSTERY** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: donaldDuckFocusedFlatfoot.cost,
//       Hand: [donaldDuckFocusedFlatfoot],
//       Deck: [tipoGrowingSon],
//     });
//
//     Const cardUnderTest = testStore.getCard(donaldDuckFocusedFlatfoot);
//     Const topDeckCard = testStore.getCard(tipoGrowingSon);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [topDeckCard] });
//
//     Expect(topDeckCard.zone).toEqual("inkwell");
//     Expect(topDeckCard.ready).toEqual(false);
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
