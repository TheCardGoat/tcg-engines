// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { pachaTrekmate } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("FULL PACK While you have more cards in hand than each opponent, this character gets +2 {L}.", () => {
//   It("should have +2 {L} if having more cards in hand", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: pachaTrekmate.cost,
//         Play: [pachaTrekmate],
//         Hand: [letTheStormRageOn, suddenChill],
//       },
//       {
//         Inkwell: pachaTrekmate.cost,
//         Play: [],
//         Hand: [brawl],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(pachaTrekmate);
//
//     Expect(cardUnderTest.lore).toBe(3);
//   });
//   It("should not have +2 {L} if not having more cards in hand", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: pachaTrekmate.cost,
//         Play: [pachaTrekmate],
//         Hand: [letTheStormRageOn],
//       },
//       {
//         Inkwell: pachaTrekmate.cost,
//         Play: [],
//         Hand: [brawl],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(pachaTrekmate);
//
//     Expect(cardUnderTest.lore).toBe(1);
//   });
// });
//
