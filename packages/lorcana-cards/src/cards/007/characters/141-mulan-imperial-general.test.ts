// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { calhounMarineSergeant } from "@lorcanito/lorcana-engine/cards/006";
// Import { mulanImperialGeneral } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mulan - Imperial General", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mulan.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mulanImperialGeneral],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mulanImperialGeneral);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mulanImperialGeneral],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mulanImperialGeneral);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It(`EXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.`, async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mulanImperialGeneral.cost,
//         Play: [mulanImperialGeneral, mrSmeeBumblingMate, calhounMarineSergeant],
//       },
//       {
//         Play: [tipoGrowingSon, hiramFlavershamToymaker],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(mulanImperialGeneral);
//     Const smee = testEngine.getCardModel(mrSmeeBumblingMate);
//     Const calhoun = testEngine.getCardModel(calhounMarineSergeant);
//
//     Const tipo = testEngine.getCardModel(tipoGrowingSon);
//     Const hiram = testEngine.getCardModel(hiramFlavershamToymaker);
//
//     Tipo.updateCardMeta({ exerted: true });
//
//     CardUnderTest.challenge(tipo);
//     Smee.challenge(hiram);
//     Calhoun.challenge(hiram);
//
//     Expect(testEngine.getCardZone(tipo)).toBe("discard");
//     Expect(testEngine.getCardZone(hiram)).toBe("discard");
//     Expect(cardUnderTest.meta.damage).toBe(1);
//     Expect(smee.meta.damage).toBe(1);
//   });
// });
//
