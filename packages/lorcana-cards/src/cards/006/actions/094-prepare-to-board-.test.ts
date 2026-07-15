// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuckBuccaneer,
//   PeterPanShadowFinder,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { prepareToBoard } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prepare To Board!", () => {
//   It("[Non Pirate] Chosen character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: prepareToBoard.cost,
//       Hand: [prepareToBoard],
//       Play: [peterPanShadowFinder],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", prepareToBoard.id);
//     Const target = testStore.getByZoneAndId("play", peterPanShadowFinder.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
//   });
//
//   It("[Pirate] Chosen character gets +3 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: prepareToBoard.cost,
//       Hand: [prepareToBoard],
//       Play: [donaldDuckBuccaneer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", prepareToBoard.id);
//     Const target = testStore.getByZoneAndId("play", donaldDuckBuccaneer.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 3);
//   });
// });
//
