// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { simbaSonOfMufasa } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Simba - Son of Mufasa", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: simbaSonOfMufasa.cost,
//       Play: [simbaSonOfMufasa],
//     });
//
//     Const cardUnderTest = testStore.getCard(simbaSonOfMufasa);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**FEARSOME ROAR** When you play this character, you may banish chosen item or location.", () => {
//     Const testStore = new TestStore({
//       Inkwell: simbaSonOfMufasa.cost,
//       Hand: [simbaSonOfMufasa],
//     });
//
//     Const cardUnderTest = testStore.getCard(simbaSonOfMufasa);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
