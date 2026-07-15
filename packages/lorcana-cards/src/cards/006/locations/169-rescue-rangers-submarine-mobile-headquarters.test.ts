// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { daleFriendInNeed } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { rescueRangersSubmarineMobileHeadquarters } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rescue Rangers Submarine - Mobile Headquarters", () => {
//   It("PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: rescueRangersSubmarineMobileHeadquarters.moveCost,
//         Deck: 5,
//         Play: [rescueRangersSubmarineMobileHeadquarters, daleFriendInNeed],
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.moveToLocation({
//       Location: rescueRangersSubmarineMobileHeadquarters,
//       Character: daleFriendInNeed,
//     });
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Inkwell: rescueRangersSubmarineMobileHeadquarters.moveCost + 1,
//         Hand: 1,
//         Deck: 3,
//       }),
//     );
//   });
// });
//
