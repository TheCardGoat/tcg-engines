// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { namaariResoluteDaughter } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Namaari - Resolute Daughter", () => {
//   It.skip("**I DON’T HAVE ANY OTHER CHOICE** For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.<br/>**Resist** +3 _(Damage dealt to this character is reduced by 3.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: namaariResoluteDaughter.cost,
//       Play: [namaariResoluteDaughter],
//     });
//
//     Const cardUnderTest = testStore.getCard(namaariResoluteDaughter);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
