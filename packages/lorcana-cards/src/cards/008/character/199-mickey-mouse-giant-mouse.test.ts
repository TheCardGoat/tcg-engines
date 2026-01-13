// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import {
//   goonsMaleficent,
//   maleficentMonstrousDragon,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { montereyJackGoodheartedRanger } from "@lorcanito/lorcana-engine/cards/006";
// import { mickeyMouseGiantMouse } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mickey Mouse - Giant Mouse", () => {
//   it("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [mickeyMouseGiantMouse],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(mickeyMouseGiantMouse);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   it("THE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: dragonFire.cost,
//         play: [mickeyMouseGiantMouse, goonsMaleficent],
//         hand: [dragonFire],
//       },
//       {
//         play: [maleficentMonstrousDragon, montereyJackGoodheartedRanger],
//       },
//     );
//
//     await testEngine.playCard(dragonFire);
//     await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
//     expect(testEngine.getCardModel(maleficentMonstrousDragon).zone).toBe(
//       "discard",
//     );
//     expect(testEngine.getCardModel(montereyJackGoodheartedRanger).damage).toBe(
//       5,
//     );
//     expect(testEngine.getCardModel(goonsMaleficent).zone).toBe("play");
//   });
// });
//
