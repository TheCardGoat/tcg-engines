// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeastAggressiveLord,
//   GoliathGuardianOfCastleWyvern,
//   IchabodCraneBookishSchoolmaster,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ichabod Crane - Bookish Schoolmaster", () => {
//   It("WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goliathGuardianOfCastleWyvern.cost,
//       Play: [ichabodCraneBookishSchoolmaster],
//       Hand: [goliathGuardianOfCastleWyvern],
//     });
//
//     Await testEngine.playCard(goliathGuardianOfCastleWyvern);
//
//     Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(
//       GoliathGuardianOfCastleWyvern.cost,
//     );
//     Await testEngine.questCard(ichabodCraneBookishSchoolmaster);
//     Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(
//       GoliathGuardianOfCastleWyvern.cost + 1,
//     );
//   });
//
//   It("Do not trigger when char with less than 5 str is played", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: beastAggressiveLord.cost,
//       Play: [ichabodCraneBookishSchoolmaster],
//       Hand: [beastAggressiveLord],
//     });
//
//     Await testEngine.playCard(beastAggressiveLord);
//
//     Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(
//       BeastAggressiveLord.cost,
//     );
//     Await testEngine.questCard(ichabodCraneBookishSchoolmaster);
//     Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(
//       BeastAggressiveLord.cost,
//     );
//   });
// });
//
