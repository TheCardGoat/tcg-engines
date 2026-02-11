// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DaleMischievousRanger,
//   GadgetHackwrenchBrilliantBosun,
//   HoneyLemonChemicalGenius,
//   JimHawkinsHonorablePirate,
//   SisuInHerElement,
//   StitchAlienBuccaneer,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { fredGiantsized } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fred - Giant-Sized", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Fred.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [fredGiantsized],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(fredGiantsized);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   Describe("I LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.", () => {
//     It("Happy Path", async () => {
//       Const testEngine = new TestEngine({
//         Play: [fredGiantsized],
//         Deck: [stitchAlienBuccaneer],
//       });
//
//       Await testEngine.questCard(fredGiantsized);
//       Expect(testEngine.getCardModel(stitchAlienBuccaneer).zone).toBe("hand");
//       Expect(testEngine.getCardModel(stitchAlienBuccaneer).isRevealed).toBe(
//         True,
//       );
//     });
//
//     It("Sad Path", async () => {
//       Const testEngine = new TestEngine({
//         Play: [fredGiantsized],
//         Deck: [sisuInHerElement],
//       });
//
//       Await testEngine.questCard(fredGiantsized);
//
//       Expect(testEngine.getCardModel(sisuInHerElement).zone).toBe("deck");
//       Expect(testEngine.getCardModel(sisuInHerElement).isRevealed).toBe(false);
//     });
//
//     It("Mixed", async () => {
//       Const beforeElements = [daleMischievousRanger, sisuInHerElement];
//       Const afterElements = [
//         JimHawkinsHonorablePirate,
//         HoneyLemonChemicalGenius,
//       ];
//       Const testEngine = new TestEngine({
//         Play: [fredGiantsized],
//         Deck: [
//           GadgetHackwrenchBrilliantBosun,
//           ...afterElements,
//           StitchAlienBuccaneer,
//           ...beforeElements,
//         ],
//       });
//
//       Await testEngine.questCard(fredGiantsized);
//
//       For (const card of [...beforeElements, ...afterElements]) {
//         Expect(testEngine.getCardModel(card).zone).toBe("deck");
//         Expect(testEngine.getCardModel(card).isRevealed).toBe(false);
//       }
//
//       Expect(testEngine.getCardModel(stitchAlienBuccaneer).zone).toBe("hand");
//       Expect(testEngine.getCardModel(stitchAlienBuccaneer).isRevealed).toBe(
//         True,
//       );
//
//       Expect(testEngine.getCardModel(gadgetHackwrenchBrilliantBosun).zone).toBe(
//         "deck",
//       );
//       Expect(
//         TestEngine.getCardModel(gadgetHackwrenchBrilliantBosun).isRevealed,
//       ).toBe(false);
//     });
//   });
// });
//
