// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { stitchAlienBuccaneer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { galacticCouncilChamber } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Galactic Council Chamber - Courtroom", () => {
//   It("**FEDERATION DECREE** While you have an Alien or Robot character here, this location can’t be challenged.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: galacticCouncilChamber.moveCost,
//         Play: [galacticCouncilChamber, stitchAlienBuccaneer],
//       },
//       {
//         Play: [goofyKnightForADay],
//         Deck: 2,
//       },
//     );
//     Const cardUnderTest = testEngine.getCardModel(galacticCouncilChamber);
//     Const challenger = testEngine.getCardModel(goofyKnightForADay);
//
//     Expect(cardUnderTest.canBeChallenged(challenger)).toEqual(true);
//
//     Await testEngine.moveToLocation({
//       Location: galacticCouncilChamber,
//       Character: stitchAlienBuccaneer,
//     });
//
//     Expect(cardUnderTest.canBeChallenged(challenger)).toEqual(false);
//     Expect(challenger.canChallenge(cardUnderTest)).toEqual(false);
//
//     Await testEngine.passTurn("player_one");
//
//     Expect(challenger.canChallenge(cardUnderTest)).toEqual(false);
//   });
// });
//
