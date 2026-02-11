// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { baBoom } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { agrabahMarketplace } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ba-Boom!", () => {
//   It("Deal 2 damage to chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: baBoom.cost,
//       Hand: [baBoom],
//       Play: [mrSmeeBumblingMate],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", baBoom.id);
//     Const target = testStore.getByZoneAndId("play", mrSmeeBumblingMate.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.damage).toBe(2);
//   });
//
//   It("Deal 2 damage to chosen location.", () => {
//     Const testStore = new TestStore({
//       Inkwell: baBoom.cost,
//       Hand: [baBoom],
//       Play: [agrabahMarketplace],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", baBoom.id);
//     Const target = testStore.getByZoneAndId("play", agrabahMarketplace.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.damage).toBe(2);
//   });
// });
//
