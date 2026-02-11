// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilPracticedDetective,
//   TipoGrowingSon,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tipo - Growing Son", () => {
//   It("**MEASURE ME AGAIN** When you play this character, you may put a card from your hand into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: tipoGrowingSon.cost,
//       Hand: [tipoGrowingSon, basilPracticedDetective],
//     });
//
//     Const cardUnderTest = testStore.getCard(tipoGrowingSon);
//     Const target = testStore.getCard(basilPracticedDetective);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(testStore.getZonesCardCount().inkwell).toEqual(
//       TipoGrowingSon.cost + 1,
//     );
//   });
// });
//
