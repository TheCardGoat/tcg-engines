// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it, test } from "@jest/globals";
// import {
//   flintheartGlomgoldSchemingBillionaire,
//   henWenPropheticPig,
//   mickeyMouseDetective,
//   princeCharmingProtectorOfTheRealm,
//   webbyVanderquackKnowledgeSeeker,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Prince Charming - Protector of the Realm", () => {
//   it("Bodyguard", async () => {
//     const testEngine = new TestEngine({
//       play: [princeCharmingProtectorOfTheRealm],
//     });
//
//     const princeCharming = testEngine.getCardModel(
//       princeCharmingProtectorOfTheRealm,
//     );
//     expect(princeCharming.hasBodyguard).toBe(true);
//   });
//
//   describe("PROTECTIVE PRESENCE Each turn, only one character can challenge", () => {
//     it("player_one has Prince Charming", async () => {
//       const defenders = [
//         webbyVanderquackKnowledgeSeeker,
//         flintheartGlomgoldSchemingBillionaire,
//       ];
//       const attackers = [mickeyMouseDetective, henWenPropheticPig];
//       const testEngine = new TestEngine(
//         {
//           play: [princeCharmingProtectorOfTheRealm, ...attackers],
//         },
//         {
//           play: defenders,
//         },
//       );
//
//       for (const defender of defenders) {
//         await testEngine.tapCard(defender);
//       }
//
//       for (let index = 0; index < attackers.length; index++) {
//         const attacker = attackers[index];
//         const defender = defenders[index % defenders.length];
//
//         if (!(defender && attacker)) {
//           throw new Error("Defender not found");
//         }
//
//         await testEngine.challenge({
//           attacker,
//           defender,
//         });
//       }
//
//       const turn = testEngine.turnEvents("player_one");
//       expect(turn.challenges).toHaveLength(1);
//     });
//
//     it("player_two has Prince Charming", async () => {
//       const defenders = [
//         webbyVanderquackKnowledgeSeeker,
//         flintheartGlomgoldSchemingBillionaire,
//       ];
//       const attackers = [mickeyMouseDetective, henWenPropheticPig];
//       const testEngine = new TestEngine(
//         {
//           play: attackers,
//         },
//         {
//           play: [princeCharmingProtectorOfTheRealm, ...defenders],
//         },
//       );
//
//       for (const defender of defenders) {
//         await testEngine.tapCard(defender);
//       }
//
//       for (let index = 0; index < attackers.length; index++) {
//         const attacker = attackers[index];
//         const defender = defenders[index % defenders.length];
//
//         if (!(defender && attacker)) {
//           throw new Error("Defender not found");
//         }
//
//         await testEngine.challenge({
//           attacker,
//           defender,
//         });
//       }
//
//       const turn = testEngine.turnEvents("player_one");
//       expect(turn.challenges).toHaveLength(1);
//     });
//   });
// });
//
