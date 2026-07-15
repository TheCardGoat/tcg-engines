// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { agustinMadrigalClumsyDad } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { vitalisphere } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Vitalisphere", () => {
//   It("**EXTRACT OF RUBY** 1 {I}, Banish this item - Chosen chracter gains **Rush** and gets +2 {S} this turn. _(They can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: vitalisphere.cost,
//       Play: [vitalisphere, agustinMadrigalClumsyDad],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", vitalisphere.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       AgustinMadrigalClumsyDad.id,
//     );
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasRush).toBeTruthy();
//     Expect(target.strength).toEqual(agustinMadrigalClumsyDad.strength + 2);
//     Expect(cardUnderTest.zone).toEqual("discard");
//
//     TestStore.passTurn();
//
//     Expect(target.hasRush).toBeFalsy();
//     Expect(target.strength).toEqual(agustinMadrigalClumsyDad.strength);
//   });
// });
//
