// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it, test } from "@jest/globals";
// Import {
//   FlintheartGlomgoldSchemingBillionaire,
//   HenWenPropheticPig,
//   MickeyMouseDetective,
//   PrinceCharmingProtectorOfTheRealm,
//   WebbyVanderquackKnowledgeSeeker,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Prince Charming - Protector of the Realm", () => {
//   It("Bodyguard", async () => {
//     Const testEngine = new TestEngine({
//       Play: [princeCharmingProtectorOfTheRealm],
//     });
//
//     Const princeCharming = testEngine.getCardModel(
//       PrinceCharmingProtectorOfTheRealm,
//     );
//     Expect(princeCharming.hasBodyguard).toBe(true);
//   });
//
//   Describe("PROTECTIVE PRESENCE Each turn, only one character can challenge", () => {
//     It("player_one has Prince Charming", async () => {
//       Const defenders = [
//         WebbyVanderquackKnowledgeSeeker,
//         FlintheartGlomgoldSchemingBillionaire,
//       ];
//       Const attackers = [mickeyMouseDetective, henWenPropheticPig];
//       Const testEngine = new TestEngine(
//         {
//           Play: [princeCharmingProtectorOfTheRealm, ...attackers],
//         },
//         {
//           Play: defenders,
//         },
//       );
//
//       For (const defender of defenders) {
//         Await testEngine.tapCard(defender);
//       }
//
//       For (let index = 0; index < attackers.length; index++) {
//         Const attacker = attackers[index];
//         Const defender = defenders[index % defenders.length];
//
//         If (!(defender && attacker)) {
//           Throw new Error("Defender not found");
//         }
//
//         Await testEngine.challenge({
//           Attacker,
//           Defender,
//         });
//       }
//
//       Const turn = testEngine.turnEvents("player_one");
//       Expect(turn.challenges).toHaveLength(1);
//     });
//
//     It("player_two has Prince Charming", async () => {
//       Const defenders = [
//         WebbyVanderquackKnowledgeSeeker,
//         FlintheartGlomgoldSchemingBillionaire,
//       ];
//       Const attackers = [mickeyMouseDetective, henWenPropheticPig];
//       Const testEngine = new TestEngine(
//         {
//           Play: attackers,
//         },
//         {
//           Play: [princeCharmingProtectorOfTheRealm, ...defenders],
//         },
//       );
//
//       For (const defender of defenders) {
//         Await testEngine.tapCard(defender);
//       }
//
//       For (let index = 0; index < attackers.length; index++) {
//         Const attacker = attackers[index];
//         Const defender = defenders[index % defenders.length];
//
//         If (!(defender && attacker)) {
//           Throw new Error("Defender not found");
//         }
//
//         Await testEngine.challenge({
//           Attacker,
//           Defender,
//         });
//       }
//
//       Const turn = testEngine.turnEvents("player_one");
//       Expect(turn.challenges).toHaveLength(1);
//     });
//   });
// });
//
