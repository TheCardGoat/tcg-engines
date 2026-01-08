// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { ursulaWhisperOfVanessa } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ursula - Whisper of Vanessa", () => {
//   it("SLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 1,
//       play: [ursulaWhisperOfVanessa],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ursulaWhisperOfVanessa);
//
//     expect(cardUnderTest.lore).toBe(ursulaWhisperOfVanessa.lore);
//     expect(cardUnderTest.hasEvasive).toBe(false);
//
//     await testEngine.activateCard(ursulaWhisperOfVanessa);
//     expect(cardUnderTest.cardsUnder).toHaveLength(1);
//
//     expect(cardUnderTest.lore).toBe(ursulaWhisperOfVanessa.lore + 1);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
