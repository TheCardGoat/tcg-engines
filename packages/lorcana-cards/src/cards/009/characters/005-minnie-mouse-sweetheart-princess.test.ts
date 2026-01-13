// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseArtfulRogue } from "@lorcanito/lorcana-engine/cards/001/characters/088-mickey-mouse-artful-rogue";
// import { cobraBubblesSimpleEducator } from "@lorcanito/lorcana-engine/cards/002/characters/004-cobra-bubbles-just-a-social-worker";
// import {
//   minnieMouseSweetheartPrincess,
//   powerlineWorldsGreatestRockStar,
// } from "@lorcanito/lorcana-engine/cards/009";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Minnie Mouse - Sweetheart Princess", () => {
//   it("ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     const testEngine = new TestEngine({
//       play: [minnieMouseSweetheartPrincess, mickeyMouseArtfulRogue],
//     });
//
//     const mickeyMouse = testEngine.getCardModel(mickeyMouseArtfulRogue);
//
//     expect(mickeyMouse.hasSupport).toBe(true);
//   });
//
//   it("BYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [minnieMouseSweetheartPrincess],
//       },
//       {
//         play: [cobraBubblesSimpleEducator],
//       },
//     );
//
//     await testEngine.tapCard(cobraBubblesSimpleEducator);
//     await testEngine.questCard(minnieMouseSweetheartPrincess);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({
//       targets: [cobraBubblesSimpleEducator],
//     });
//
//     expect(testEngine.getCardModel(cobraBubblesSimpleEducator).zone).toBe(
//       "discard",
//     );
//   });
//
//   describe("Regression Tests", () => {
//     it("Should banish only one character", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [minnieMouseSweetheartPrincess],
//         },
//         {
//           play: [
//             powerlineWorldsGreatestRockStar,
//             powerlineWorldsGreatestRockStar,
//           ],
//         },
//       );
//
//       const powerOne = testEngine.getCardModel(
//         powerlineWorldsGreatestRockStar,
//         0,
//       );
//       const powerTwo = testEngine.getCardModel(
//         powerlineWorldsGreatestRockStar,
//         1,
//       );
//
//       await testEngine.tapCard(powerOne);
//       await testEngine.tapCard(powerTwo);
//
//       await testEngine.questCard(minnieMouseSweetheartPrincess);
//
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({
//         targets: [powerOne],
//       });
//
//       expect(powerOne.zone).toBe("discard");
//       expect(powerTwo.zone).toBe("play");
//     });
//   });
// });
//
