// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MufasaRulerOfPrideRock,
//   ScarBetrayer,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scar - Betrayer", () => {
//   It("**LONG LIVE THE KING** When you play this character, you may banish chosen character named Mufasa.", () => {
//     Const testStore = new TestStore({
//       Inkwell: scarBetrayer.cost,
//       Hand: [scarBetrayer],
//       Play: [mufasaRulerOfPrideRock],
//     });
//
//     Const cardUnderTest = testStore.getCard(scarBetrayer);
//     Const mufasa = testStore.getCard(mufasaRulerOfPrideRock);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [mufasa] });
//
//     Expect(mufasa.zone).toEqual("discard");
//   });
// });
//
