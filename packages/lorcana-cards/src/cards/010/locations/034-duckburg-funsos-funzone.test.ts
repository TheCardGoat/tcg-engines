// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ElsaQueenRegent,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { duckburgFunsosFunzone } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Duckburg - Funsos Funzone", () => {
//   Describe("WHERE FUN IS IN THE ZONE", () => {
//     Describe("Location can be played normally", () => {
//       It("can be played from hand with sufficient ink", async () => {
//         Const testEngine = new TestEngine({
//           Inkwell: duckburgFunsosFunzone.cost,
//           Hand: [duckburgFunsosFunzone],
//         });
//
//         Await testEngine.playCard(duckburgFunsosFunzone);
//
//         Const locationCard = testEngine.getByZoneAndId(
//           "play",
//           DuckburgFunsosFunzone.id,
//         );
//         Expect(locationCard.zone).toBe("play");
//       });
//     });
//
//     Describe("Cost reduction trigger", () => {
//       It("reduces cost of next character by 2 when a character quests while at this location", async () => {
//         Const testEngine = new TestEngine({
//           Inkwell:
//             DuckburgFunsosFunzone.cost +
//             MickeyMouseTrueFriend.cost +
//             ElsaQueenRegent.cost,
//           Hand: [duckburgFunsosFunzone, mickeyMouseTrueFriend, elsaQueenRegent],
//         });
//
//         // Play the location
//         Await testEngine.playCard(duckburgFunsosFunzone);
//
//         // Play a character
//         Await testEngine.playCard(mickeyMouseTrueFriend);
//
//         // Move character to the location
//         Await testEngine.moveToLocation({
//           Location: duckburgFunsosFunzone,
//           Character: mickeyMouseTrueFriend,
//         });
//
//         // Use questCard to simulate the quest
//         Await testEngine.questCard(mickeyMouseTrueFriend);
//
//         // Now the cost reduction should be active for the next character
//         Const expensiveCharacter = testEngine.getByZoneAndId(
//           "hand",
//           ElsaQueenRegent.id,
//         );
//
//         // Elsa costs 6, should now cost 4 (6 - 2 = 4) after ability triggers
//         Expect(expensiveCharacter.cost).toBe(4);
//       });
//     });
//   });
// });
//
