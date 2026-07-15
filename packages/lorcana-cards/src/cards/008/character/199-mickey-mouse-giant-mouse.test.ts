// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   GoonsMaleficent,
//   MaleficentMonstrousDragon,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { montereyJackGoodheartedRanger } from "@lorcanito/lorcana-engine/cards/006";
// Import { mickeyMouseGiantMouse } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Giant Mouse", () => {
//   It("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mickeyMouseGiantMouse],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMouseGiantMouse);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("THE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: dragonFire.cost,
//         Play: [mickeyMouseGiantMouse, goonsMaleficent],
//         Hand: [dragonFire],
//       },
//       {
//         Play: [maleficentMonstrousDragon, montereyJackGoodheartedRanger],
//       },
//     );
//
//     Await testEngine.playCard(dragonFire);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
//     Expect(testEngine.getCardModel(maleficentMonstrousDragon).zone).toBe(
//       "discard",
//     );
//     Expect(testEngine.getCardModel(montereyJackGoodheartedRanger).damage).toBe(
//       5,
//     );
//     Expect(testEngine.getCardModel(goonsMaleficent).zone).toBe("play");
//   });
// });
//
