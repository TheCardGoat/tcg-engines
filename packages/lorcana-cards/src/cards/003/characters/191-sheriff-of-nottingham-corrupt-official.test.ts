// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   RobinHoodBelovedOutlaw,
//   SheriffOfNottinghamCorruptOfficial,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sheriff of Nottingham - Corrupt Official", () => {
//   It.skip("**TAXES SHOULD HURT** Whenever you discard a card, you may deal 1 damage to chosen opposing character.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: sheriffOfNottinghamCorruptOfficial.cost,
//       Play: [sheriffOfNottinghamCorruptOfficial],
//     });
//   });
// });
//
// Describe("regression test", () => {
//   It("should not trigger if opponent discards", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: suddenChill.cost,
//         Play: [sheriffOfNottinghamCorruptOfficial],
//         Hand: [suddenChill],
//       },
//       {
//         Hand: [robinHoodBelovedOutlaw],
//       },
//     );
//
//     Await testEngine.playCard(suddenChill);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({ targets: [robinHoodBelovedOutlaw] });
//     TestEngine.changeActivePlayer("player_one");
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
