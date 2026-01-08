// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { paintingTheRosesRed } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import {
//   dopeyAlwaysPlayful,
//   eudoraAccomplishedSeamstress,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Painting the Roses Red", () => {
//   describe("Up to 2 chosen characters get -1 {S} this turn. Draw a card.", () => {
//     it("Draw a card", () => {
//       const testStore = new TestStore({
//         inkwell: paintingTheRosesRed.cost,
//         hand: [paintingTheRosesRed],
//         deck: 1,
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         paintingTheRosesRed.id,
//       );
//
//       cardUnderTest.playFromHand();
//       testStore.resolveTopOfStack({ targets: [] });
//
//       expect(testStore.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           hand: 1,
//           deck: 0,
//         }),
//       );
//     });
//
//     it("Up to 2 chosen characters get -1 {S} this turn.", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: paintingTheRosesRed.cost,
//           hand: [paintingTheRosesRed],
//           play: [dopeyAlwaysPlayful, eudoraAccomplishedSeamstress],
//           deck: 1,
//         },
//         {
//           deck: 1,
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         paintingTheRosesRed.id,
//       );
//       const target = testStore.getByZoneAndId("play", dopeyAlwaysPlayful.id);
//       const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         eudoraAccomplishedSeamstress.id,
//       );
//
//       cardUnderTest.playFromHand();
//       testStore.resolveTopOfStack({ targets: [target, anotherTarget] });
//
//       [target, anotherTarget].forEach((card) => {
//         expect(card.strength).toEqual((card.lorcanitoCard.strength || 0) - 1);
//       });
//
//       testStore.passTurn();
//
//       [target, anotherTarget].forEach((card) => {
//         expect(card.strength).toEqual(card.lorcanitoCard.strength);
//       });
//     });
//   });
// });
//
