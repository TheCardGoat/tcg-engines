// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MiloThatchCleverCartographer,
//   StarkeyDeviousPirate,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { thebesTheBigOlive } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Thebes - The Big Olive", () => {
//   It("During your turn, whenever a character banishes another character in a challenge while here, you gain 2 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: thebesTheBigOlive.moveCost,
//         Play: [starkeyDeviousPirate, thebesTheBigOlive],
//       },
//       {
//         Play: [miloThatchCleverCartographer],
//       },
//     );
//
//     Await testEngine.moveToLocation({
//       Location: thebesTheBigOlive,
//       Character: starkeyDeviousPirate,
//     });
//     Await testEngine.tapCard(miloThatchCleverCartographer);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(0);
//     Await testEngine.challenge({
//       Attacker: starkeyDeviousPirate,
//       Defender: miloThatchCleverCartographer,
//     });
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
//
//   It("Doesnt trigger when characters are not in the location", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [starkeyDeviousPirate, thebesTheBigOlive],
//       },
//       {
//         Play: [miloThatchCleverCartographer],
//       },
//     );
//
//     Await testEngine.tapCard(miloThatchCleverCartographer);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(0);
//     Await testEngine.challenge({
//       Attacker: starkeyDeviousPirate,
//       Defender: miloThatchCleverCartographer,
//     });
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(0);
//   });
// });
//
