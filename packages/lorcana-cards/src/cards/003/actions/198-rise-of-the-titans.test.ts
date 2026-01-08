// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { riseOfTheTitans } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { cleansingRainwater } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { agrabahMarketplace } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Rise of the Titans", () => {
//   it("Banish chosen item.", () => {
//     const testStore = new TestStore({
//       inkwell: riseOfTheTitans.cost,
//       hand: [riseOfTheTitans],
//       play: [cleansingRainwater],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", riseOfTheTitans.id);
//     const target = testStore.getByZoneAndId("play", cleansingRainwater.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toEqual("discard");
//   });
//
//   it("Banish chosen location.", () => {
//     const testStore = new TestStore({
//       inkwell: riseOfTheTitans.cost,
//       hand: [riseOfTheTitans],
//       play: [agrabahMarketplace],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", riseOfTheTitans.id);
//     const target = testStore.getByZoneAndId("play", agrabahMarketplace.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toEqual("discard");
//   });
// });
//
