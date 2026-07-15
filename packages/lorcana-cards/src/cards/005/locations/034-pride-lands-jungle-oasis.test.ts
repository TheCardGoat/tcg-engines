// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PumbaFriendlyWarhog,
//   SimbaFutureKing,
//   SimbaReturnedKing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { prideLandsJungleOasis } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pride Lands - Jungle Oasis", () => {
//   Describe("**OUR HUMBLE HOME**While you have 3 or more characters here, you may banish this location to play a character from your discard for free.", () => {
//     It("Shouldn't be activated if there's less than 3 chars", () => {
//       Const testStore = new TestStore({
//         Inkwell: prideLandsJungleOasis.moveCost * 2,
//         Play: [prideLandsJungleOasis, simbaFutureKing, pumbaFriendlyWarhog],
//         Discard: [mufasaBetrayedLeader],
//       });
//
//       Const cardUnderTest = testStore.getCard(prideLandsJungleOasis);
//       Const charOne = testStore.getCard(simbaFutureKing);
//       Const charTwo = testStore.getCard(pumbaFriendlyWarhog);
//
//       [charOne, charTwo].forEach((char) => {
//         Char.enterLocation(cardUnderTest);
//       });
//
//       CardUnderTest.activate();
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("Activates with 3", () => {
//       Const testStore = new TestStore({
//         Inkwell: prideLandsJungleOasis.moveCost * 3,
//         Play: [
//           PrideLandsJungleOasis,
//           SimbaFutureKing,
//           PumbaFriendlyWarhog,
//           SimbaReturnedKing,
//         ],
//         Discard: [mufasaBetrayedLeader],
//       });
//
//       Const cardUnderTest = testStore.getCard(prideLandsJungleOasis);
//       Const target = testStore.getCard(mufasaBetrayedLeader);
//
//       Const charOne = testStore.getCard(simbaFutureKing);
//       Const charTwo = testStore.getCard(pumbaFriendlyWarhog);
//       Const charThree = testStore.getCard(simbaReturnedKing);
//
//       [charOne, charTwo, charThree].forEach((char) => {
//         Char.enterLocation(cardUnderTest);
//       });
//
//       Expect(cardUnderTest.getCardsAtLocation).toHaveLength(3);
//       CardUnderTest.activate();
//       Expect(testStore.stackLayers).toHaveLength(1);
//       TestStore.resolveTopOfStack({ targets: [target] });
//     });
//   });
// });
//
