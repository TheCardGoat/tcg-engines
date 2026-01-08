// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import {
//   mauiHalfshark,
//   sailTheAzuriteSea,
// } from "@lorcanito/lorcana-engine/cards/006";
// import { ludwigVonDrakeAllaroundExpert } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ludwig Von Drake - All-Around Expert", () => {
//   it("SUPERIOR MIND When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: ludwigVonDrakeAllaroundExpert.cost,
//         hand: [ludwigVonDrakeAllaroundExpert],
//       },
//       {
//         hand: [bePrepared, sailTheAzuriteSea, mauiHalfshark],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(
//       ludwigVonDrakeAllaroundExpert,
//     );
//     const target = testEngine.getCardModel(bePrepared);
//     const opponentsHand = testEngine.getCardsByZone("hand", "player_two");
//
//     await testEngine.playCard(ludwigVonDrakeAllaroundExpert);
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toEqual("discard");
//     expect(opponentsHand.every((card) => card.meta.revealed)).toEqual(true);
//   });
//
//   it("LASTING LEGACY When this character is banished, you may put this card into your inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: ludwigVonDrakeAllaroundExpert.cost,
//         play: [ludwigVonDrakeAllaroundExpert],
//       },
//       {
//         play: [mauiHalfshark],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(
//       ludwigVonDrakeAllaroundExpert,
//     );
//     cardUnderTest.updateCardMeta({ exerted: true });
//
//     const attacker = testEngine.getCardModel(mauiHalfshark);
//     attacker.challenge(cardUnderTest);
//
//     testEngine.resolveOptionalAbility();
//
//     expect(cardUnderTest.zone).toEqual("inkwell");
//     expect(cardUnderTest.ready).toEqual(false);
//   });
// });
//
