// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { luckyThe_15thPuppy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import {
//   antoniosJaguarFaithfulCompanion,
//   calhounHardnosedLeader,
//   dalmatianPuppyTailWagger,
//   televisionSet,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Television Set", () => {
//   it("IS IT ON YET? {E}, 1 {I} – Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 1,
//       play: [televisionSet],
//       deck: [luckyThe_15thPuppy, dalmatianPuppyTailWagger],
//     });
//
//     await testEngine.activateCard(televisionSet);
//     await testEngine.resolveOptionalAbility();
//
//     expect(testEngine.getCardModel(televisionSet).exerted).toBe(true);
//     expect(testEngine.getCardModel(luckyThe_15thPuppy).zone).toBe("deck");
//     expect(testEngine.getCardModel(dalmatianPuppyTailWagger).zone).toBe("hand");
//     expect(testEngine.getCardModel(dalmatianPuppyTailWagger).isRevealed).toBe(
//       true,
//     );
//   });
//
//   it("Not a puppy on top", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 1,
//       play: [televisionSet],
//       deck: [
//         calhounHardnosedLeader,
//         dalmatianPuppyTailWagger,
//         antoniosJaguarFaithfulCompanion,
//       ],
//     });
//
//     await testEngine.activateCard(televisionSet);
//     await testEngine.resolveOptionalAbility();
//
//     expect(testEngine.getCardModel(televisionSet).exerted).toBe(true);
//     expect(testEngine.getCardModel(dalmatianPuppyTailWagger).zone).toBe("deck");
//     expect(testEngine.getCardModel(dalmatianPuppyTailWagger).isRevealed).toBe(
//       false,
//     );
//   });
// });
//
