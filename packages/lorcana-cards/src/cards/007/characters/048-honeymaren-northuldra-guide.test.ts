// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   NeverLandMermaidLagoon,
//   PrideLandsPrideRock,
// } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import {
//   BelleApprenticeInventor,
//   BoltHeadstrongDog,
//   HoneymarenNorthuldraGuide,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Honeymaren - Northuldra Guide", () => {
//   Describe("TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.", () => {
//     It("gain 1 lore when the opponent has an exerted character in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: honeymarenNorthuldraGuide.cost,
//           Hand: [honeymarenNorthuldraGuide],
//         },
//         {
//           Play: [boltHeadstrongDog],
//         },
//       );
//
//       Await testEngine.tapCard(boltHeadstrongDog);
//       Const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       Await testEngine.playCard(honeymarenNorthuldraGuide);
//       Const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       Expect(finalLore).toBe(initialLore + 1);
//     });
//
//     It("does NOT gain 1 lore if the opponent has no exerted character in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: honeymarenNorthuldraGuide.cost,
//           Hand: [honeymarenNorthuldraGuide],
//         },
//         {
//           Play: [boltHeadstrongDog],
//         },
//       );
//
//       Const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       Await testEngine.playCard(honeymarenNorthuldraGuide);
//       Const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       Expect(finalLore).toBe(initialLore);
//     });
//
//     It("does NOT gain 1 lore if player own character is exerted", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: honeymarenNorthuldraGuide.cost,
//         Hand: [honeymarenNorthuldraGuide],
//         Play: [boltHeadstrongDog],
//       });
//
//       Await testEngine.tapCard(boltHeadstrongDog);
//       Const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       Await testEngine.playCard(honeymarenNorthuldraGuide);
//       Const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       Expect(finalLore).toBe(initialLore);
//     });
//   });
// });
//
// Describe("Regression tests", () => {
//   It("does NOT gain 1 lore for location", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: honeymarenNorthuldraGuide.cost,
//         Hand: [honeymarenNorthuldraGuide],
//         Play: [boltHeadstrongDog, neverLandMermaidLagoon],
//       },
//       {
//         Play: [belleApprenticeInventor, prideLandsPrideRock],
//       },
//     );
//
//     Const initialLore = testEngine.getLoreForPlayer("player_one");
//     Await testEngine.playCard(honeymarenNorthuldraGuide);
//     Const finalLore = testEngine.getLoreForPlayer("player_one");
//
//     Expect(finalLore).toBe(initialLore);
//   });
// });
//
