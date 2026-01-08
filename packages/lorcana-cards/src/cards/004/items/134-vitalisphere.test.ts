// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { agustinMadrigalClumsyDad } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { vitalisphere } from "@lorcanito/lorcana-engine/cards/004/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Vitalisphere", () => {
//   it("**EXTRACT OF RUBY** 1 {I}, Banish this item - Chosen chracter gains **Rush** and gets +2 {S} this turn. _(They can challenge the turn they're played.)_", () => {
//     const testStore = new TestStore({
//       inkwell: vitalisphere.cost,
//       play: [vitalisphere, agustinMadrigalClumsyDad],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", vitalisphere.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       agustinMadrigalClumsyDad.id,
//     );
//
//     cardUnderTest.activate();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.hasRush).toBeTruthy();
//     expect(target.strength).toEqual(agustinMadrigalClumsyDad.strength + 2);
//     expect(cardUnderTest.zone).toEqual("discard");
//
//     testStore.passTurn();
//
//     expect(target.hasRush).toBeFalsy();
//     expect(target.strength).toEqual(agustinMadrigalClumsyDad.strength);
//   });
// });
//
