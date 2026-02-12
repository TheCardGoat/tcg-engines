// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { simbaFutureKing } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mufasaChampionOfThePrideLands } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { prideLandsPrideRock } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pride Lands - Pride Rock", () => {
//   It.skip("**WE ARE ALL CONNECTED** Characters get +2 {W} while here.**LION HOME** If you have a Prince or King character here, you pay 1 {I} less to play characters.", () => {
//     Const testStore = new TestStore({
//       Inkwell: prideLandsPrideRock.cost,
//       Play: [prideLandsPrideRock],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PrideLandsPrideRock.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It("**LION HOME** If you have a Prince or King character here, you pay 1 {I} less to play characters.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell:
//         PrideLandsPrideRock.moveCost + mufasaChampionOfThePrideLands.cost - 1,
//       Play: [prideLandsPrideRock, simbaFutureKing],
//       Hand: [mufasaChampionOfThePrideLands],
//     });
//
//     Const cardToPlayFromHand = testEngine.getCardModel(
//       MufasaChampionOfThePrideLands,
//     );
//
//     Expect(cardToPlayFromHand.cost).toBe(mufasaChampionOfThePrideLands.cost);
//
//     Await testEngine.moveToLocation({
//       Location: prideLandsPrideRock,
//       Character: simbaFutureKing,
//     });
//
//     Expect(cardToPlayFromHand.cost).toBe(
//       MufasaChampionOfThePrideLands.cost - 1,
//     );
//   });
// });
//
