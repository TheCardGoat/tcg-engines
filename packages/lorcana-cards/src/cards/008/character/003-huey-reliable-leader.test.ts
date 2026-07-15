// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DalmatianPuppyTailWagger,
//   HueyReliableLeader,
//   PerditaOnTheLookout,
//   TianaNaturalTalent,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Huey - Reliable Leader", () => {
//   It("I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 3,
//       Play: [hueyReliableLeader],
//       Hand: [tianaNaturalTalent], // Cost 4
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(hueyReliableLeader);
//
//     CardUnderTest.quest();
//
//     Await testEngine.playCard(tianaNaturalTalent);
//
//     Expect(testEngine.getZonesCardCount().play).toBe(2);
//     Expect(testEngine.store.tableStore.getTable().inkAvailable()).toEqual(0);
//     // console.log();
//   });
//
//   It("Player1 have hueyReliableLeader in play and 3 ink. He will can play 2 cards with cost 2 ink, only after quest of hueyReliableLeader. First card will be cost 1 ink and for second card pay full cost.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 3,
//       Play: [hueyReliableLeader],
//       Hand: [dalmatianPuppyTailWagger, perditaOnTheLookout],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(hueyReliableLeader);
//
//     CardUnderTest.quest();
//
//     Await testEngine.playCard(dalmatianPuppyTailWagger);
//     Expect(testEngine.store.tableStore.getTable().inkAvailable()).toEqual(2);
//
//     Await testEngine.playCard(perditaOnTheLookout);
//     Expect(testEngine.store.tableStore.getTable().inkAvailable()).toEqual(0);
//
//     Expect(testEngine.getZonesCardCount().play).toBe(3);
//   });
// });
//
