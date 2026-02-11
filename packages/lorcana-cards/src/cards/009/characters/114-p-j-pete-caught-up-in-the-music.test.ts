// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { thisIsMyFamily } from "@lorcanito/lorcana-engine/cards/007";
// Import { pjPeteCaughtUpInTheMusic } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("P.J. Pete - Caught Up in the Music", () => {
//   It("SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: thisIsMyFamily.cost,
//       Play: [pjPeteCaughtUpInTheMusic],
//       Hand: [thisIsMyFamily],
//     });
//
//     Const cardToPlay = testEngine.getCardModel(thisIsMyFamily);
//     Const cardUnderTest = testEngine.getCardModel(pjPeteCaughtUpInTheMusic);
//
//     Expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength);
//
//     Await testEngine.playCard(cardToPlay);
//
//     Expect(testEngine.getPlayerLore()).toBe(1);
//     Expect(testEngine.getCardsByZone.length).toBe(1);
//
//     Expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength + 2);
//
//     Await testEngine.passTurn();
//
//     Expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength);
//   });
// });
//
