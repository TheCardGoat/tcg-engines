// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseGiantMouse,
//   MostEveryonesMadHere,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Most Everyone's Mad Here", () => {
//   It("Gain lore equal to the damage on chosen character, then banish them.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mostEveryonesMadHere.cost,
//         Hand: [mostEveryonesMadHere],
//       },
//       {
//         Play: [mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testEngine.setCardDamage(mickeyMouseGiantMouse, 5);
//
//     Await testEngine.playCard(mostEveryonesMadHere, {
//       Targets: [mickeyMouseGiantMouse],
//     });
//
//     Expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("discard");
//     Expect(testEngine.getPlayerLore("player_one")).toBe(5);
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//   });
//
//   It("Character with no damage", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mostEveryonesMadHere.cost,
//         Hand: [mostEveryonesMadHere],
//       },
//       {
//         Play: [mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testEngine.playCard(mostEveryonesMadHere, {
//       Targets: [mickeyMouseGiantMouse],
//     });
//
//     Expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("discard");
//     Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//   });
// });
//
