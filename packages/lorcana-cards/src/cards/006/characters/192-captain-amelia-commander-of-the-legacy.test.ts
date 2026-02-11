// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CaptainAmeliaCommanderOfTheLegacy,
//   ChipRangerLeader,
//   HoneyLemonChemicalGenius,
//   JafarPowerhungryVizier,
//   JimHawkinsHonorablePirate,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Captain Amelia - Commander of the Legacy", () => {
//   It("DRIVELING GALOOTS This character can't be challenged by Pirate characters.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [captainAmeliaCommanderOfTheLegacy],
//       },
//       {
//         Play: [jimHawkinsHonorablePirate, honeyLemonChemicalGenius],
//       },
//     );
//
//     Const pirate = testEngine.getCardModel(jimHawkinsHonorablePirate);
//     Const nonPirate = testEngine.getCardModel(honeyLemonChemicalGenius);
//     Const cardUnderTest = testEngine.getCardModel(
//       CaptainAmeliaCommanderOfTheLegacy,
//     );
//
//     Await testEngine.tapCard(captainAmeliaCommanderOfTheLegacy);
//
//     Expect(nonPirate.canChallenge(cardUnderTest)).toBe(true);
//     Expect(cardUnderTest.canBeChallenged(nonPirate)).toBe(true);
//
//     Expect(pirate.canChallenge(cardUnderTest)).toBe(false);
//     Expect(cardUnderTest.canBeChallenged(pirate)).toBe(false);
//   });
//
//   It("EVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [chipRangerLeader],
//       },
//       {
//         Play: [captainAmeliaCommanderOfTheLegacy, jafarPowerhungryVizier],
//       },
//     );
//
//     Const challenged = await testEngine.tapCard(jafarPowerhungryVizier);
//
//     Expect(challenged.hasResist).toBe(false);
//
//     Await testEngine.challenge({
//       Attacker: chipRangerLeader,
//       Defender: jafarPowerhungryVizier,
//     });
//
//     Expect(challenged.damage).toBe(chipRangerLeader.strength - 1);
//   });
//
//   It("EVERYTHING SHIPSHAPE Does not trigger when challenging", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [captainAmeliaCommanderOfTheLegacy, jafarPowerhungryVizier],
//       },
//       {
//         Play: [chipRangerLeader],
//       },
//     );
//
//     Const defender = await testEngine.tapCard(chipRangerLeader);
//     Const challenger = await testEngine.getCardModel(jafarPowerhungryVizier);
//
//     Expect(defender.hasResist).toBe(false);
//
//     Await testEngine.challenge({
//       Attacker: jafarPowerhungryVizier,
//       Defender: chipRangerLeader,
//     });
//
//     Expect(challenger.damage).toBe(defender.strength);
//   });
// });
//
