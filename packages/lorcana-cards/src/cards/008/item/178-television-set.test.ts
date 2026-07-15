// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { luckyThe_15thPuppy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   AntoniosJaguarFaithfulCompanion,
//   CalhounHardnosedLeader,
//   DalmatianPuppyTailWagger,
//   TelevisionSet,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Television Set", () => {
//   It("IS IT ON YET? {E}, 1 {I} – Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 1,
//       Play: [televisionSet],
//       Deck: [luckyThe_15thPuppy, dalmatianPuppyTailWagger],
//     });
//
//     Await testEngine.activateCard(televisionSet);
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardModel(televisionSet).exerted).toBe(true);
//     Expect(testEngine.getCardModel(luckyThe_15thPuppy).zone).toBe("deck");
//     Expect(testEngine.getCardModel(dalmatianPuppyTailWagger).zone).toBe("hand");
//     Expect(testEngine.getCardModel(dalmatianPuppyTailWagger).isRevealed).toBe(
//       True,
//     );
//   });
//
//   It("Not a puppy on top", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 1,
//       Play: [televisionSet],
//       Deck: [
//         CalhounHardnosedLeader,
//         DalmatianPuppyTailWagger,
//         AntoniosJaguarFaithfulCompanion,
//       ],
//     });
//
//     Await testEngine.activateCard(televisionSet);
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardModel(televisionSet).exerted).toBe(true);
//     Expect(testEngine.getCardModel(dalmatianPuppyTailWagger).zone).toBe("deck");
//     Expect(testEngine.getCardModel(dalmatianPuppyTailWagger).isRevealed).toBe(
//       False,
//     );
//   });
// });
//
