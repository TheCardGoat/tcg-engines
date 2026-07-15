// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ursulaWhisperOfVanessa } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ursula - Whisper of Vanessa", () => {
//   It("SLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 1,
//       Play: [ursulaWhisperOfVanessa],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(ursulaWhisperOfVanessa);
//
//     Expect(cardUnderTest.lore).toBe(ursulaWhisperOfVanessa.lore);
//     Expect(cardUnderTest.hasEvasive).toBe(false);
//
//     Await testEngine.activateCard(ursulaWhisperOfVanessa);
//     Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//
//     Expect(cardUnderTest.lore).toBe(ursulaWhisperOfVanessa.lore + 1);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
