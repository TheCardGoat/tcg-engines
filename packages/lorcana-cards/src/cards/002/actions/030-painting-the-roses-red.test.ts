// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { paintingTheRosesRed } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   DopeyAlwaysPlayful,
//   EudoraAccomplishedSeamstress,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Painting the Roses Red", () => {
//   Describe("Up to 2 chosen characters get -1 {S} this turn. Draw a card.", () => {
//     It("Draw a card", () => {
//       Const testStore = new TestStore({
//         Inkwell: paintingTheRosesRed.cost,
//         Hand: [paintingTheRosesRed],
//         Deck: 1,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         PaintingTheRosesRed.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [] });
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 0,
//         }),
//       );
//     });
//
//     It("Up to 2 chosen characters get -1 {S} this turn.", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: paintingTheRosesRed.cost,
//           Hand: [paintingTheRosesRed],
//           Play: [dopeyAlwaysPlayful, eudoraAccomplishedSeamstress],
//           Deck: 1,
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         PaintingTheRosesRed.id,
//       );
//       Const target = testStore.getByZoneAndId("play", dopeyAlwaysPlayful.id);
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         EudoraAccomplishedSeamstress.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target, anotherTarget] });
//
//       [target, anotherTarget].forEach((card) => {
//         Expect(card.strength).toEqual((card.lorcanitoCard.strength || 0) - 1);
//       });
//
//       TestStore.passTurn();
//
//       [target, anotherTarget].forEach((card) => {
//         Expect(card.strength).toEqual(card.lorcanitoCard.strength);
//       });
//     });
//   });
// });
//
