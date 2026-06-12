// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GastonFrightfulBully,
//   MinnieMouseGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { bromBonesBurlyBully } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe.skip("Brom Bones - Burly Bully", () => {
//   Describe.skip("ROUGH AND TUMBLE Whenever this character challenges a character with 2 or less, each opponent loses 1 lore.", () => {
//     It("should make each opponent lose 1 lore when challenging a character with 2 or less strength", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: bromBonesBurlyBully.cost,
//           Play: [bromBonesBurlyBully],
//         },
//         {
//           Play: [minnieMouseGhostHunter],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(bromBonesBurlyBully);
//       Const opponentCharacter = testEngine.getCardModel(minnieMouseGhostHunter);
//
//       // Initial lore should be 0
//       Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//       // Play Brom Bones
//       Await testEngine.playCard(bromBonesBurlyBully);
//       Await testEngine.resolveTopOfStack({});
//
//       // Ready Brom Bones and challenge weak character
//       Await testEngine.tapCard(bromBonesBurlyBully, false); // Ready the character
//       Await testEngine.challenge({
//         Attacker: bromBonesBurlyBully,
//         Defender: minnieMouseGhostHunter,
//       });
//
//       // Should trigger Brom Bones' ability and resolve
//       Await testEngine.resolveTopOfStack({});
//
//       // Each opponent should lose 1 lore
//       Expect(testEngine.getPlayerLore("player_two")).toBe(-1);
//     });
//
//     It("should not trigger when challenging a character with more than 2 strength", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: bromBonesBurlyBully.cost,
//           Play: [bromBonesBurlyBully],
//         },
//         {
//           Play: [gastonFrightfulBully],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(bromBonesBurlyBully);
//       Const opponentCharacter = testEngine.getCardModel(gastonFrightfulBully);
//
//       // Initial lore should be 0
//       Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//       // Play Brom Bones
//       Await testEngine.playCard(bromBonesBurlyBully);
//       Await testEngine.resolveTopOfStack({});
//
//       // Ready Brom Bones and challenge strong character
//       Await testEngine.tapCard(bromBonesBurlyBully, false); // Ready the character
//       Await testEngine.challenge({
//         Attacker: bromBonesBurlyBully,
//         Defender: gastonFrightfulBully,
//       });
//
//       // Should resolve without triggering Brom Bones' ability
//       Await testEngine.resolveTopOfStack({});
//
//       // No lore loss should occur
//       Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//     });
//   });
// });
//
