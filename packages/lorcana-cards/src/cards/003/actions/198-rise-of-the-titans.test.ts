// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { riseOfTheTitans } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { cleansingRainwater } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { agrabahMarketplace } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rise of the Titans", () => {
//   It("Banish chosen item.", () => {
//     Const testStore = new TestStore({
//       Inkwell: riseOfTheTitans.cost,
//       Hand: [riseOfTheTitans],
//       Play: [cleansingRainwater],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", riseOfTheTitans.id);
//     Const target = testStore.getByZoneAndId("play", cleansingRainwater.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
//
//   It("Banish chosen location.", () => {
//     Const testStore = new TestStore({
//       Inkwell: riseOfTheTitans.cost,
//       Hand: [riseOfTheTitans],
//       Play: [agrabahMarketplace],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", riseOfTheTitans.id);
//     Const target = testStore.getByZoneAndId("play", agrabahMarketplace.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
