// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { owlIslandSecludedEntrance } from "@lorcanito/lorcana-engine/cards/006";
// Import { jimHawkinsRiggerSpecialist } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jim Hawkins - Rigger Specialist", () => {
//   It.skip("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jim Hawkins.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jimHawkinsRiggerSpecialist],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(jimHawkinsRiggerSpecialist);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("BATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jimHawkinsRiggerSpecialist.cost,
//       Hand: [jimHawkinsRiggerSpecialist],
//       Play: [owlIslandSecludedEntrance],
//     });
//
//     Await testEngine.playCard(jimHawkinsRiggerSpecialist);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
