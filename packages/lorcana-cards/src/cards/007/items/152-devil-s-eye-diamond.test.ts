// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { plasmaBlaster } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import {
//   DevilsEyeDiamond,
//   MulanDisguisedSoldier,
//   SuzyMasterSeamstress,
//   TobyDoggedCompanion,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Devil's Eye Diamond", () => {
//   It("THE PRICE OF POWER {E} - If one of your characters was damaged this turn, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 2,
//         Inkwell: 2,
//         Play: [devilsEyeDiamond, plasmaBlaster, suzyMasterSeamstress],
//       },
//       {
//         Deck: 2,
//       },
//     );
//     Expect(testEngine.getLoreForPlayer()).toBe(0);
//
//     Await testEngine.activateCard(plasmaBlaster, {
//       Targets: [suzyMasterSeamstress],
//     });
//     Expect(testEngine.getCardModel(suzyMasterSeamstress).damage).toBe(1);
//
//     Await testEngine.activateCard(devilsEyeDiamond);
//     Expect(testEngine.getCardModel(devilsEyeDiamond).exerted).toBe(true);
//
//     Expect(testEngine.getLoreForPlayer()).toBe(1);
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     // If damage was not taken during the turn, lore should not be gained
//     Expect(testEngine.getCardModel(devilsEyeDiamond).exerted).toBe(false);
//     Await testEngine.activateCard(devilsEyeDiamond);
//
//     Expect(testEngine.getLoreForPlayer()).toBe(1);
//   });
// });
//
// Describe("Regression", () => {
//   It("Should be able to activate Devil's Eye Diamond when characters are banished by damage", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 2,
//         Inkwell: 2,
//         Play: [devilsEyeDiamond, mulanDisguisedSoldier],
//       },
//       {
//         Play: [tobyDoggedCompanion],
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: mulanDisguisedSoldier,
//       Defender: tobyDoggedCompanion,
//       ExertDefender: true,
//     });
//
//     Await testEngine.activateCard(devilsEyeDiamond);
//     Expect(testEngine.getCardModel(devilsEyeDiamond).exerted).toBe(true);
//     Expect(testEngine.getLoreForPlayer()).toBe(1);
//   });
// });
//
