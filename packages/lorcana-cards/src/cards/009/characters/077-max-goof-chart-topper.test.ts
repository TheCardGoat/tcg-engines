// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { thisIsMyFamily } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   CharlotteLaBouffMardiGrasPrincess,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { maxGoofChartTopper } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Max Goof - Chart Topper", () => {
//   It("Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Max Goof.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [maxGoofChartTopper],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(maxGoofChartTopper);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("NUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [maxGoofChartTopper],
//       Discard: [thisIsMyFamily],
//       Deck: [deweyLovableShowoff, charlotteLaBouffMardiGrasPrincess],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(maxGoofChartTopper);
//     Const targetCard = testEngine.getCardModel(thisIsMyFamily);
//
//     Expect(testEngine.getCardsByZone("deck").length).toBe(2);
//     Expect(testEngine.getCardsByZone("discard").length).toBe(1);
//
//     Await testEngine.questCard(cardUnderTest);
//     Expect(testEngine.getPlayerLore()).toBe(2);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] }, true);
//     Await testEngine.resolveTopOfStack({});
//
//     // This is my Family draws you a card, and give one lore
//     Expect(testEngine.getPlayerLore()).toBe(3);
//     Expect(testEngine.getCardsByZone("hand").length).toBe(1);
//
//     // You initially had 2, you drew 1, and put the other on the bottom of your deck
//     Expect(testEngine.getCardsByZone("deck").length).toBe(2);
//     Expect(testEngine.getCardsByZone("discard").length).toBe(0);
//   });
// });
//
