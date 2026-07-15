// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseArtfulRogue } from "@lorcanito/lorcana-engine/cards/001/characters/088-mickey-mouse-artful-rogue";
// Import { cobraBubblesSimpleEducator } from "@lorcanito/lorcana-engine/cards/002/characters/004-cobra-bubbles-just-a-social-worker";
// Import {
//   MinnieMouseSweetheartPrincess,
//   PowerlineWorldsGreatestRockStar,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Minnie Mouse - Sweetheart Princess", () => {
//   It("ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [minnieMouseSweetheartPrincess, mickeyMouseArtfulRogue],
//     });
//
//     Const mickeyMouse = testEngine.getCardModel(mickeyMouseArtfulRogue);
//
//     Expect(mickeyMouse.hasSupport).toBe(true);
//   });
//
//   It("BYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [minnieMouseSweetheartPrincess],
//       },
//       {
//         Play: [cobraBubblesSimpleEducator],
//       },
//     );
//
//     Await testEngine.tapCard(cobraBubblesSimpleEducator);
//     Await testEngine.questCard(minnieMouseSweetheartPrincess);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [cobraBubblesSimpleEducator],
//     });
//
//     Expect(testEngine.getCardModel(cobraBubblesSimpleEducator).zone).toBe(
//       "discard",
//     );
//   });
//
//   Describe("Regression Tests", () => {
//     It("Should banish only one character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [minnieMouseSweetheartPrincess],
//         },
//         {
//           Play: [
//             PowerlineWorldsGreatestRockStar,
//             PowerlineWorldsGreatestRockStar,
//           ],
//         },
//       );
//
//       Const powerOne = testEngine.getCardModel(
//         PowerlineWorldsGreatestRockStar,
//         0,
//       );
//       Const powerTwo = testEngine.getCardModel(
//         PowerlineWorldsGreatestRockStar,
//         1,
//       );
//
//       Await testEngine.tapCard(powerOne);
//       Await testEngine.tapCard(powerTwo);
//
//       Await testEngine.questCard(minnieMouseSweetheartPrincess);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({
//         Targets: [powerOne],
//       });
//
//       Expect(powerOne.zone).toBe("discard");
//       Expect(powerTwo.zone).toBe("play");
//     });
//   });
// });
//
