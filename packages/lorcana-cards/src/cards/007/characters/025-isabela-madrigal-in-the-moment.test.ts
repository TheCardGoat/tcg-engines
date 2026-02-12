// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HesATramp,
//   IsabelaMadrigalInTheMoment,
//   LadyMissParkAvenue,
//   SoMuchToGive,
//   TheTroubadourMusicalNarrator,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Isabela Madrigal - In the Moment", () => {
//   It("I WILL NOT BE PERFECT Every time one of your characters sings a song, this character cannot be challenged until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 2,
//         Inkwell: isabelaMadrigalInTheMoment.cost,
//         Play: [isabelaMadrigalInTheMoment, theTroubadourMusicalNarrator],
//         Hand: [hesATramp, soMuchToGive],
//       },
//       {
//         Play: [ladyMissParkAvenue],
//       },
//     );
//     Const cardUnderTest = testEngine.getCardModel(isabelaMadrigalInTheMoment);
//     Const anotherSinger = testEngine.getCardModel(theTroubadourMusicalNarrator);
//     Const attacker = testEngine.getCardModel(ladyMissParkAvenue);
//
//     Await testEngine.singSong({
//       Singer: theTroubadourMusicalNarrator,
//       Song: hesATramp,
//     });
//     Await testEngine.resolveTopOfStack({
//       Targets: [theTroubadourMusicalNarrator],
//     });
//
//     Expect(cardUnderTest.canBeChallenged(attacker)).toBe(false);
//
//     Await testEngine.singSong({
//       Singer: isabelaMadrigalInTheMoment,
//       Song: soMuchToGive,
//     });
//     Await testEngine.resolveTopOfStack({
//       Targets: [isabelaMadrigalInTheMoment],
//     });
//
//     Await testEngine.passTurn();
//
//     Expect(cardUnderTest.canBeChallenged(attacker)).toBe(false);
//     Expect(anotherSinger.canBeChallenged(attacker)).toBe(true);
//   });
// });
//
