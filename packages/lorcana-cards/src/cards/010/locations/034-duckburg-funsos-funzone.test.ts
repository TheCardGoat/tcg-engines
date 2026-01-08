// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   elsaQueenRegent,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { duckburgFunsosFunzone } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Duckburg - Funsos Funzone", () => {
//   describe("WHERE FUN IS IN THE ZONE", () => {
//     describe("Location can be played normally", () => {
//       it("can be played from hand with sufficient ink", async () => {
//         const testEngine = new TestEngine({
//           inkwell: duckburgFunsosFunzone.cost,
//           hand: [duckburgFunsosFunzone],
//         });
//
//         await testEngine.playCard(duckburgFunsosFunzone);
//
//         const locationCard = testEngine.getByZoneAndId(
//           "play",
//           duckburgFunsosFunzone.id,
//         );
//         expect(locationCard.zone).toBe("play");
//       });
//     });
//
//     describe("Cost reduction trigger", () => {
//       it("reduces cost of next character by 2 when a character quests while at this location", async () => {
//         const testEngine = new TestEngine({
//           inkwell:
//             duckburgFunsosFunzone.cost +
//             mickeyMouseTrueFriend.cost +
//             elsaQueenRegent.cost,
//           hand: [duckburgFunsosFunzone, mickeyMouseTrueFriend, elsaQueenRegent],
//         });
//
//         // Play the location
//         await testEngine.playCard(duckburgFunsosFunzone);
//
//         // Play a character
//         await testEngine.playCard(mickeyMouseTrueFriend);
//
//         // Move character to the location
//         await testEngine.moveToLocation({
//           location: duckburgFunsosFunzone,
//           character: mickeyMouseTrueFriend,
//         });
//
//         // Use questCard to simulate the quest
//         await testEngine.questCard(mickeyMouseTrueFriend);
//
//         // Now the cost reduction should be active for the next character
//         const expensiveCharacter = testEngine.getByZoneAndId(
//           "hand",
//           elsaQueenRegent.id,
//         );
//
//         // Elsa costs 6, should now cost 4 (6 - 2 = 4) after ability triggers
//         expect(expensiveCharacter.cost).toBe(4);
//       });
//     });
//   });
// });
//
