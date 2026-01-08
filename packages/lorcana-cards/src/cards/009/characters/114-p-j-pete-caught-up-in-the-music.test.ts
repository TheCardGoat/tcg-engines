// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { thisIsMyFamily } from "@lorcanito/lorcana-engine/cards/007";
// import { pjPeteCaughtUpInTheMusic } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("P.J. Pete - Caught Up in the Music", () => {
//   it("SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: thisIsMyFamily.cost,
//       play: [pjPeteCaughtUpInTheMusic],
//       hand: [thisIsMyFamily],
//     });
//
//     const cardToPlay = testEngine.getCardModel(thisIsMyFamily);
//     const cardUnderTest = testEngine.getCardModel(pjPeteCaughtUpInTheMusic);
//
//     expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength);
//
//     await testEngine.playCard(cardToPlay);
//
//     expect(testEngine.getPlayerLore()).toBe(1);
//     expect(testEngine.getCardsByZone.length).toBe(1);
//
//     expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength + 2);
//
//     await testEngine.passTurn();
//
//     expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength);
//   });
// });
//
