// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   beastAggressiveLord,
//   goliathGuardianOfCastleWyvern,
//   ichabodCraneBookishSchoolmaster,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ichabod Crane - Bookish Schoolmaster", () => {
//   it("WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: goliathGuardianOfCastleWyvern.cost,
//       play: [ichabodCraneBookishSchoolmaster],
//       hand: [goliathGuardianOfCastleWyvern],
//     });
//
//     await testEngine.playCard(goliathGuardianOfCastleWyvern);
//
//     expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(
//       goliathGuardianOfCastleWyvern.cost,
//     );
//     await testEngine.questCard(ichabodCraneBookishSchoolmaster);
//     expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(
//       goliathGuardianOfCastleWyvern.cost + 1,
//     );
//   });
//
//   it("Do not trigger when char with less than 5 str is played", async () => {
//     const testEngine = new TestEngine({
//       inkwell: beastAggressiveLord.cost,
//       play: [ichabodCraneBookishSchoolmaster],
//       hand: [beastAggressiveLord],
//     });
//
//     await testEngine.playCard(beastAggressiveLord);
//
//     expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(
//       beastAggressiveLord.cost,
//     );
//     await testEngine.questCard(ichabodCraneBookishSchoolmaster);
//     expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(
//       beastAggressiveLord.cost,
//     );
//   });
// });
//
