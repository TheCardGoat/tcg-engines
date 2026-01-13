// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   denahiImpatientHunter,
//   ladyMissParkAvenue,
//   trampEnterprisingDog,
// } from "@lorcanito/lorcana-engine/cards/007";
// import {
//   druunRavenousPlague,
//   ladyDecisiveDog,
//   trampObservantGuardian,
//   wasabiAlwaysPrepared,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lady - Decisive Dog", () => {
//   it("TAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}. + PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 4,
//       play: [ladyDecisiveDog],
//       hand: [trampEnterprisingDog, trampObservantGuardian],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ladyDecisiveDog);
//
//     expect(cardUnderTest.strength).toBe(0);
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.playCard(trampObservantGuardian);
//     await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     expect(cardUnderTest.strength).toBe(1);
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.playCard(trampEnterprisingDog);
//     await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     // Lady +1 {S} & Tramp +2 {S}
//     expect(cardUnderTest.strength).toBe(4);
//     expect(cardUnderTest.lore).toBe(3);
//   });
// });
//
// describe("Lady - Decisive Dog", () => {
//   it("Shifting her should keep the strenght but not the lore gained", async () => {
//     const testEngine = new TestEngine({
//       inkwell:
//         denahiImpatientHunter.cost +
//         ladyDecisiveDog.cost +
//         druunRavenousPlague.cost +
//         wasabiAlwaysPrepared.cost +
//         4 +
//         3,
//       play: [ladyDecisiveDog],
//       hand: [
//         denahiImpatientHunter,
//         druunRavenousPlague,
//         ladyMissParkAvenue,
//         wasabiAlwaysPrepared,
//       ],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ladyDecisiveDog);
//
//     expect(cardUnderTest.strength).toBe(0);
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.playCard(druunRavenousPlague);
//     expect(cardUnderTest.strength).toBe(ladyDecisiveDog.strength + 1);
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.playCard(denahiImpatientHunter);
//     expect(cardUnderTest.strength).toBe(ladyDecisiveDog.strength + 2);
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.playCard(wasabiAlwaysPrepared);
//     expect(cardUnderTest.strength).toBe(ladyDecisiveDog.strength + 3);
//     expect(cardUnderTest.lore).toBe(3);
//
//     const { shifter } = await testEngine.shiftCard({
//       shifted: ladyDecisiveDog,
//       shifter: ladyMissParkAvenue,
//     });
//     await testEngine.skipTopOfStack();
//
//     expect(shifter.lore).toBe(ladyMissParkAvenue.lore);
//     expect(shifter.strength).toBe(ladyMissParkAvenue.strength + 3);
//   });
// });
//
