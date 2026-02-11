// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   MauiHalfshark,
//   SailTheAzuriteSea,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { ludwigVonDrakeAllaroundExpert } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ludwig Von Drake - All-Around Expert", () => {
//   It("SUPERIOR MIND When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ludwigVonDrakeAllaroundExpert.cost,
//         Hand: [ludwigVonDrakeAllaroundExpert],
//       },
//       {
//         Hand: [bePrepared, sailTheAzuriteSea, mauiHalfshark],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(
//       LudwigVonDrakeAllaroundExpert,
//     );
//     Const target = testEngine.getCardModel(bePrepared);
//     Const opponentsHand = testEngine.getCardsByZone("hand", "player_two");
//
//     Await testEngine.playCard(ludwigVonDrakeAllaroundExpert);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//     Expect(opponentsHand.every((card) => card.meta.revealed)).toEqual(true);
//   });
//
//   It("LASTING LEGACY When this character is banished, you may put this card into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ludwigVonDrakeAllaroundExpert.cost,
//         Play: [ludwigVonDrakeAllaroundExpert],
//       },
//       {
//         Play: [mauiHalfshark],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(
//       LudwigVonDrakeAllaroundExpert,
//     );
//     CardUnderTest.updateCardMeta({ exerted: true });
//
//     Const attacker = testEngine.getCardModel(mauiHalfshark);
//     Attacker.challenge(cardUnderTest);
//
//     TestEngine.resolveOptionalAbility();
//
//     Expect(cardUnderTest.zone).toEqual("inkwell");
//     Expect(cardUnderTest.ready).toEqual(false);
//   });
// });
//
