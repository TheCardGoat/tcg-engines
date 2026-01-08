// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   pumbaFriendlyWarhog,
//   simbaFutureKing,
//   simbaReturnedKing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { prideLandsJungleOasis } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Pride Lands - Jungle Oasis", () => {
//   describe("**OUR HUMBLE HOME**While you have 3 or more characters here, you may banish this location to play a character from your discard for free.", () => {
//     it("Shouldn't be activated if there's less than 3 chars", () => {
//       const testStore = new TestStore({
//         inkwell: prideLandsJungleOasis.moveCost * 2,
//         play: [prideLandsJungleOasis, simbaFutureKing, pumbaFriendlyWarhog],
//         discard: [mufasaBetrayedLeader],
//       });
//
//       const cardUnderTest = testStore.getCard(prideLandsJungleOasis);
//       const charOne = testStore.getCard(simbaFutureKing);
//       const charTwo = testStore.getCard(pumbaFriendlyWarhog);
//
//       [charOne, charTwo].forEach((char) => {
//         char.enterLocation(cardUnderTest);
//       });
//
//       cardUnderTest.activate();
//       expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     it("Activates with 3", () => {
//       const testStore = new TestStore({
//         inkwell: prideLandsJungleOasis.moveCost * 3,
//         play: [
//           prideLandsJungleOasis,
//           simbaFutureKing,
//           pumbaFriendlyWarhog,
//           simbaReturnedKing,
//         ],
//         discard: [mufasaBetrayedLeader],
//       });
//
//       const cardUnderTest = testStore.getCard(prideLandsJungleOasis);
//       const target = testStore.getCard(mufasaBetrayedLeader);
//
//       const charOne = testStore.getCard(simbaFutureKing);
//       const charTwo = testStore.getCard(pumbaFriendlyWarhog);
//       const charThree = testStore.getCard(simbaReturnedKing);
//
//       [charOne, charTwo, charThree].forEach((char) => {
//         char.enterLocation(cardUnderTest);
//       });
//
//       expect(cardUnderTest.getCardsAtLocation).toHaveLength(3);
//       cardUnderTest.activate();
//       expect(testStore.stackLayers).toHaveLength(1);
//       testStore.resolveTopOfStack({ targets: [target] });
//     });
//   });
// });
//
