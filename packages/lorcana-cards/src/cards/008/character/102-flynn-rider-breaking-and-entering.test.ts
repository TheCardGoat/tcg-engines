// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FlynnRiderBreakingAndEntering,
//   MontereyJackDefiantProtector,
//   WasabiAlwaysPrepared,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Flynn Rider - Breaking and Entering", () => {
//   Describe("THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don’t, you gain 2 lore.", () => {
//     It("Discarding a card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [wasabiAlwaysPrepared],
//           Hand: [montereyJackDefiantProtector],
//         },
//         {
//           Play: [flynnRiderBreakingAndEntering],
//         },
//       );
//
//       Await testEngine.challenge({
//         Defender: flynnRiderBreakingAndEntering,
//         Attacker: wasabiAlwaysPrepared,
//         ExertDefender: true,
//       });
//
//       Await testEngine.resolveTopOfStack(
//         {
//           Mode: "1",
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [montereyJackDefiantProtector],
//       });
//
//       Expect(testEngine.getCardModel(montereyJackDefiantProtector).zone).toBe(
//         "discard",
//       );
//       Expect(testEngine.getPlayerLore()).toBe(0);
//       Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//     });
//
//     It("gain lore", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [wasabiAlwaysPrepared],
//           Hand: [montereyJackDefiantProtector],
//         },
//         {
//           Play: [flynnRiderBreakingAndEntering],
//         },
//       );
//
//       Await testEngine.challenge({
//         Defender: flynnRiderBreakingAndEntering,
//         Attacker: wasabiAlwaysPrepared,
//         ExertDefender: true,
//       });
//
//       Await testEngine.resolveTopOfStack({
//         Mode: "2",
//       });
//
//       Expect(testEngine.getCardModel(montereyJackDefiantProtector).zone).toBe(
//         "hand",
//       );
//       Expect(testEngine.getPlayerLore("player_two")).toBe(2);
//     });
//   });
// });
//
// Describe("Regression Test", () => {
//   It("Should not trigger when opponent has no cards", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [wasabiAlwaysPrepared],
//         Hand: [],
//       },
//       {
//         Play: [flynnRiderBreakingAndEntering],
//       },
//     );
//
//     Await testEngine.challenge({
//       Defender: flynnRiderBreakingAndEntering,
//       Attacker: wasabiAlwaysPrepared,
//       ExertDefender: true,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//   });
// });
//
