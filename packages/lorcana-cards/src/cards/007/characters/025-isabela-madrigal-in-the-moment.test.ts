// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   hesATramp,
//   isabelaMadrigalInTheMoment,
//   ladyMissParkAvenue,
//   soMuchToGive,
//   theTroubadourMusicalNarrator,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Isabela Madrigal - In the Moment", () => {
//   it("I WILL NOT BE PERFECT Every time one of your characters sings a song, this character cannot be challenged until the start of your next turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         deck: 2,
//         inkwell: isabelaMadrigalInTheMoment.cost,
//         play: [isabelaMadrigalInTheMoment, theTroubadourMusicalNarrator],
//         hand: [hesATramp, soMuchToGive],
//       },
//       {
//         play: [ladyMissParkAvenue],
//       },
//     );
//     const cardUnderTest = testEngine.getCardModel(isabelaMadrigalInTheMoment);
//     const anotherSinger = testEngine.getCardModel(theTroubadourMusicalNarrator);
//     const attacker = testEngine.getCardModel(ladyMissParkAvenue);
//
//     await testEngine.singSong({
//       singer: theTroubadourMusicalNarrator,
//       song: hesATramp,
//     });
//     await testEngine.resolveTopOfStack({
//       targets: [theTroubadourMusicalNarrator],
//     });
//
//     expect(cardUnderTest.canBeChallenged(attacker)).toBe(false);
//
//     await testEngine.singSong({
//       singer: isabelaMadrigalInTheMoment,
//       song: soMuchToGive,
//     });
//     await testEngine.resolveTopOfStack({
//       targets: [isabelaMadrigalInTheMoment],
//     });
//
//     await testEngine.passTurn();
//
//     expect(cardUnderTest.canBeChallenged(attacker)).toBe(false);
//     expect(anotherSinger.canBeChallenged(attacker)).toBe(true);
//   });
// });
//
