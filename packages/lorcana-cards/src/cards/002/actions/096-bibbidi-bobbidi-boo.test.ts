// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuck,
//   TamatoaDrabLittleCrab,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { bibbidiBobbidiBoo } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   CheshireCatAlwaysGrinning,
//   FlynnRiderConfidentVagabond,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Const greenCost2 = cheshireCatAlwaysGrinning;
// Const anotherGreenCost2 = tamatoaDrabLittleCrab;
// Const greenCost1 = flynnRiderConfidentVagabond;
// Const redCost2 = donaldDuck;
//
// // TODO: I don't have a good idea on how to solve this effect
// Describe("Bibbidi Bobbidi Boo", () => {
//   Describe("Return chosen character of yours to your hand to play another character with the same cost or less for free.", () => {
//     It("should be able to play a character with the same cost, and same color", () => {
//       Const testStore = new TestStore({
//         Inkwell: bibbidiBobbidiBoo.cost,
//         Hand: [bibbidiBobbidiBoo, greenCost2],
//         Play: [anotherGreenCost2],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         BibbidiBobbidiBoo.id,
//       );
//       Const cardFromReturn = testStore.getByZoneAndId(
//         "play",
//         AnotherGreenCost2.id,
//       );
//       Const cardToPlay = testStore.getByZoneAndId("hand", greenCost2.id);
//       CardUnderTest.playFromHand();
//
//       TestStore.resolveTopOfStack({ targets: [cardFromReturn] }, true);
//       Expect(cardFromReturn.zone).toEqual("hand");
//
//       TestStore.resolveTopOfStack({ targets: [cardToPlay] });
//       Expect(cardToPlay.zone).toEqual("play");
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("should be able to play a character with the lower cost, and same color", () => {
//       Const testStore = new TestStore({
//         Inkwell: bibbidiBobbidiBoo.cost,
//         Hand: [bibbidiBobbidiBoo, greenCost1],
//         Play: [greenCost2],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         BibbidiBobbidiBoo.id,
//       );
//       Const cardToReturn = testStore.getByZoneAndId("play", greenCost2.id);
//       Const cardToPlay = testStore.getByZoneAndId("hand", greenCost1.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [cardToReturn] }, true);
//       Expect(cardToReturn.zone).toEqual("hand");
//
//       TestStore.resolveTopOfStack({ targets: [cardToPlay] });
//       Expect(cardToPlay.zone).toEqual("play");
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It.skip("should NOT be able to play a character with a higher cost", () => {
//       Const testStore = new TestStore({
//         Inkwell: bibbidiBobbidiBoo.cost,
//         Hand: [bibbidiBobbidiBoo, greenCost2],
//         Play: [greenCost1],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         BibbidiBobbidiBoo.id,
//       );
//       Const cardToReturn = testStore.getByZoneAndId("play", greenCost1.id);
//       Const cardToPlay = testStore.getByZoneAndId("hand", greenCost2.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [cardToReturn] }, true);
//       Expect(cardToReturn.zone).toEqual("hand");
//
//       TestStore.resolveTopOfStack({ targets: [cardToPlay] });
//       Expect(cardToPlay.zone).toEqual("hand");
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It.skip("should NOT be able to play a character with a different color and same cost", () => {
//       Const testStore = new TestStore({
//         Inkwell: bibbidiBobbidiBoo.cost,
//         Hand: [bibbidiBobbidiBoo, greenCost2],
//         Play: [redCost2],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         BibbidiBobbidiBoo.id,
//       );
//       Const cardToReturn = testStore.getByZoneAndId("play", redCost2.id);
//       Const cardToPlay = testStore.getByZoneAndId("hand", greenCost2.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [cardToReturn] }, true);
//       Expect(cardToReturn.zone).toEqual("hand");
//
//       TestStore.resolveTopOfStack({ targets: [cardToPlay] });
//       Expect(cardToPlay.zone).toEqual("hand");
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It.skip("should NOT be able to play again the same character", () => {
//       Const testStore = new TestStore({
//         Inkwell: bibbidiBobbidiBoo.cost,
//         Hand: [bibbidiBobbidiBoo, greenCost1],
//         Play: [greenCost2],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         BibbidiBobbidiBoo.id,
//       );
//       Const target = testStore.getByZoneAndId("play", greenCost2.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] }, true);
//       Expect(target.zone).toEqual("hand");
//
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(target.zone).toEqual("hand");
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
