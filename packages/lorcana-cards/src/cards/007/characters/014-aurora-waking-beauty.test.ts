// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MrSmee,
//   RapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { chienPoImperialSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   AuroraWakingBeauty,
//   TheFamilyMadrigal,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aurora - Waking Beauty", () => {
//   Describe("SWEET DREAMS", () => {
//     It("should ready the character when you heal your character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [auroraWakingBeauty, chienPoImperialSoldier],
//         Hand: [rapunzelGiftedWithHealing],
//         Deck: [mrSmee, mrSmee, mrSmee],
//       });
//
//       Const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
//       Const chienModel = testEngine.getCardModel(chienPoImperialSoldier);
//
//       Await testEngine.questCard(auroraWakingBeauty);
//
//       Await chienModel.updateCardDamage(1);
//
//       Await testEngine.playCard(rapunzelGiftedWithHealing);
//
//       Await testEngine.resolveTopOfStack({ targets: [chienModel] });
//
//       Expect(auroraModel.ready).toBe(true);
//       Expect(auroraModel.hasQuestRestriction).toBe(true);
//       Expect(auroraModel.hasChallengeRestriction).toBe(true);
//     });
//
//     It("should ready the character when you heal opponent's character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 5,
//           Play: [auroraWakingBeauty, pawpsicle],
//         },
//         {
//           Play: [chienPoImperialSoldier],
//         },
//       );
//
//       Const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
//       Const chienModel = testEngine.getCardModel(chienPoImperialSoldier);
//
//       Await testEngine.questCard(auroraWakingBeauty);
//
//       Await chienModel.updateCardDamage(1);
//
//       Await testEngine.activateCard(pawpsicle);
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [chienModel] }, true);
//
//       Expect(auroraModel.ready).toBe(true);
//       Expect(auroraModel.hasQuestRestriction).toBe(true);
//       Expect(auroraModel.hasChallengeRestriction).toBe(true);
//     });
//
//     It("should not ready the character when you don't heal any damage", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 5,
//           Play: [auroraWakingBeauty, pawpsicle],
//         },
//         {
//           Play: [chienPoImperialSoldier],
//         },
//       );
//
//       Const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
//       Const chienModel = testEngine.getCardModel(chienPoImperialSoldier);
//
//       Await testEngine.questCard(auroraWakingBeauty);
//
//       Await testEngine.activateCard(pawpsicle);
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [chienModel] }, true);
//
//       Expect(auroraModel.ready).toBe(false);
//       Expect(auroraModel.hasQuestRestriction).toBe(false);
//       Expect(auroraModel.hasChallengeRestriction).toBe(false);
//     });
//
//     It("should not ready when opponents heal a character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 5,
//           Play: [chienPoImperialSoldier, pawpsicle],
//         },
//         {
//           Play: [auroraWakingBeauty],
//         },
//       );
//
//       Const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
//       Const chienModel = testEngine.getCardModel(chienPoImperialSoldier);
//
//       Await testEngine.tapCard(auroraWakingBeauty);
//       Await testEngine.setCardDamage(chienModel, 1);
//
//       Await testEngine.activateCard(
//         Pawpsicle,
//         {
//           AcceptOptionalLayer: true,
//           Targets: [chienModel],
//         },
//         True,
//       );
//
//       Expect(auroraModel.ready).toBe(false);
//       Expect(auroraModel.hasQuestRestriction).toBe(false);
//       Expect(auroraModel.hasChallengeRestriction).toBe(false);
//     });
//
//     It("Singer 5 (This character counts as cost 5 to sing songs.)", async () => {
//       Const testEngine = new TestEngine({
//         Play: [auroraWakingBeauty],
//         Hand: [theFamilyMadrigal],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(auroraWakingBeauty);
//       Const song = testEngine.getCardModel(theFamilyMadrigal);
//       Expect(cardUnderTest.hasSinger).toBe(true);
//
//       Await testEngine.singSong({
//         Singer: auroraWakingBeauty,
//         Song: theFamilyMadrigal,
//       });
//
//       Expect(cardUnderTest.exerted).toBe(true);
//       Expect(song.zone).toEqual("discard");
//     });
//   });
// });
//
