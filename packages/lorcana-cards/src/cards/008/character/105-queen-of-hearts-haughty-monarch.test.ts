// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BerliozMischievousKitten,
//   DrizellaSpoiledStepsister,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   DaleBumbler,
//   NapoleonCleverBloodhound,
//   QueenOfHeartsHaughtyMonarch,
//   TipoJuniorChipmunk,
//   WilhelminaPackardRadioOperator,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Queen Of Hearts - Haughty Monarch", () => {
//   It("COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [
//           QueenOfHeartsHaughtyMonarch,
//           TipoJuniorChipmunk,
//           WilhelminaPackardRadioOperator,
//           DaleBumbler,
//           DrizellaSpoiledStepsister,
//         ],
//       },
//       {
//         Play: [napoleonCleverBloodhound, berliozMischievousKitten],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(queenOfHeartsHaughtyMonarch);
//
//     Await testEngine.setCardDamage(tipoJuniorChipmunk, 1);
//     Await testEngine.setCardDamage(daleBumbler, 1);
//     Await testEngine.setCardDamage(napoleonCleverBloodhound, 1);
//     Await testEngine.setCardDamage(drizellaSpoiledStepsister, 1);
//     Await testEngine.setCardDamage(berliozMischievousKitten, 1);
//
//     Expect(cardUnderTest.lore).toEqual(6);
//     // await testEngine.resolveOptionalAbility();
//     //await testEngine.resolveTopOfStack({});
//   });
// });
//
