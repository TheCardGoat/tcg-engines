// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { simbaFutureKing } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { mufasaChampionOfThePrideLands } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { prideLandsPrideRock } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Pride Lands - Pride Rock", () => {
//   it.skip("**WE ARE ALL CONNECTED** Characters get +2 {W} while here.**LION HOME** If you have a Prince or King character here, you pay 1 {I} less to play characters.", () => {
//     const testStore = new TestStore({
//       inkwell: prideLandsPrideRock.cost,
//       play: [prideLandsPrideRock],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       prideLandsPrideRock.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
//
//   it("**LION HOME** If you have a Prince or King character here, you pay 1 {I} less to play characters.", async () => {
//     const testEngine = new TestEngine({
//       inkwell:
//         prideLandsPrideRock.moveCost + mufasaChampionOfThePrideLands.cost - 1,
//       play: [prideLandsPrideRock, simbaFutureKing],
//       hand: [mufasaChampionOfThePrideLands],
//     });
//
//     const cardToPlayFromHand = testEngine.getCardModel(
//       mufasaChampionOfThePrideLands,
//     );
//
//     expect(cardToPlayFromHand.cost).toBe(mufasaChampionOfThePrideLands.cost);
//
//     await testEngine.moveToLocation({
//       location: prideLandsPrideRock,
//       character: simbaFutureKing,
//     });
//
//     expect(cardToPlayFromHand.cost).toBe(
//       mufasaChampionOfThePrideLands.cost - 1,
//     );
//   });
// });
//
