// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { calhounMarineSergeant } from "@lorcanito/lorcana-engine/cards/006";
// import { mulanImperialGeneral } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mulan - Imperial General", () => {
//   it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mulan.)", async () => {
//     const testEngine = new TestEngine({
//       play: [mulanImperialGeneral],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(mulanImperialGeneral);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [mulanImperialGeneral],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(mulanImperialGeneral);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it(`EXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.`, async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: mulanImperialGeneral.cost,
//         play: [mulanImperialGeneral, mrSmeeBumblingMate, calhounMarineSergeant],
//       },
//       {
//         play: [tipoGrowingSon, hiramFlavershamToymaker],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(mulanImperialGeneral);
//     const smee = testEngine.getCardModel(mrSmeeBumblingMate);
//     const calhoun = testEngine.getCardModel(calhounMarineSergeant);
//
//     const tipo = testEngine.getCardModel(tipoGrowingSon);
//     const hiram = testEngine.getCardModel(hiramFlavershamToymaker);
//
//     tipo.updateCardMeta({ exerted: true });
//
//     cardUnderTest.challenge(tipo);
//     smee.challenge(hiram);
//     calhoun.challenge(hiram);
//
//     expect(testEngine.getCardZone(tipo)).toBe("discard");
//     expect(testEngine.getCardZone(hiram)).toBe("discard");
//     expect(cardUnderTest.meta.damage).toBe(1);
//     expect(smee.meta.damage).toBe(1);
//   });
// });
//
