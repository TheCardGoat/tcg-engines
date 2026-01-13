// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   gastonFrightfulBully,
//   minnieMouseGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { bromBonesBurlyBully } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe.skip("Brom Bones - Burly Bully", () => {
//   describe.skip("ROUGH AND TUMBLE Whenever this character challenges a character with 2 or less, each opponent loses 1 lore.", () => {
//     it("should make each opponent lose 1 lore when challenging a character with 2 or less strength", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: bromBonesBurlyBully.cost,
//           play: [bromBonesBurlyBully],
//         },
//         {
//           play: [minnieMouseGhostHunter],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(bromBonesBurlyBully);
//       const opponentCharacter = testEngine.getCardModel(minnieMouseGhostHunter);
//
//       // Initial lore should be 0
//       expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//       // Play Brom Bones
//       await testEngine.playCard(bromBonesBurlyBully);
//       await testEngine.resolveTopOfStack({});
//
//       // Ready Brom Bones and challenge weak character
//       await testEngine.tapCard(bromBonesBurlyBully, false); // Ready the character
//       await testEngine.challenge({
//         attacker: bromBonesBurlyBully,
//         defender: minnieMouseGhostHunter,
//       });
//
//       // Should trigger Brom Bones' ability and resolve
//       await testEngine.resolveTopOfStack({});
//
//       // Each opponent should lose 1 lore
//       expect(testEngine.getPlayerLore("player_two")).toBe(-1);
//     });
//
//     it("should not trigger when challenging a character with more than 2 strength", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: bromBonesBurlyBully.cost,
//           play: [bromBonesBurlyBully],
//         },
//         {
//           play: [gastonFrightfulBully],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(bromBonesBurlyBully);
//       const opponentCharacter = testEngine.getCardModel(gastonFrightfulBully);
//
//       // Initial lore should be 0
//       expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//       // Play Brom Bones
//       await testEngine.playCard(bromBonesBurlyBully);
//       await testEngine.resolveTopOfStack({});
//
//       // Ready Brom Bones and challenge strong character
//       await testEngine.tapCard(bromBonesBurlyBully, false); // Ready the character
//       await testEngine.challenge({
//         attacker: bromBonesBurlyBully,
//         defender: gastonFrightfulBully,
//       });
//
//       // Should resolve without triggering Brom Bones' ability
//       await testEngine.resolveTopOfStack({});
//
//       // No lore loss should occur
//       expect(testEngine.getPlayerLore("player_two")).toBe(0);
//     });
//   });
// });
//
