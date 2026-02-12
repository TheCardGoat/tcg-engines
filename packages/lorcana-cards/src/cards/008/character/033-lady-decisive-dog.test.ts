// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DenahiImpatientHunter,
//   LadyMissParkAvenue,
//   TrampEnterprisingDog,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   DruunRavenousPlague,
//   LadyDecisiveDog,
//   TrampObservantGuardian,
//   WasabiAlwaysPrepared,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lady - Decisive Dog", () => {
//   It("TAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}. + PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 4,
//       Play: [ladyDecisiveDog],
//       Hand: [trampEnterprisingDog, trampObservantGuardian],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(ladyDecisiveDog);
//
//     Expect(cardUnderTest.strength).toBe(0);
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.playCard(trampObservantGuardian);
//     Await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     Expect(cardUnderTest.strength).toBe(1);
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.playCard(trampEnterprisingDog);
//     Await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     // Lady +1 {S} & Tramp +2 {S}
//     Expect(cardUnderTest.strength).toBe(4);
//     Expect(cardUnderTest.lore).toBe(3);
//   });
// });
//
// Describe("Lady - Decisive Dog", () => {
//   It("Shifting her should keep the strenght but not the lore gained", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell:
//         DenahiImpatientHunter.cost +
//         LadyDecisiveDog.cost +
//         DruunRavenousPlague.cost +
//         WasabiAlwaysPrepared.cost +
//         4 +
//         3,
//       Play: [ladyDecisiveDog],
//       Hand: [
//         DenahiImpatientHunter,
//         DruunRavenousPlague,
//         LadyMissParkAvenue,
//         WasabiAlwaysPrepared,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(ladyDecisiveDog);
//
//     Expect(cardUnderTest.strength).toBe(0);
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.playCard(druunRavenousPlague);
//     Expect(cardUnderTest.strength).toBe(ladyDecisiveDog.strength + 1);
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.playCard(denahiImpatientHunter);
//     Expect(cardUnderTest.strength).toBe(ladyDecisiveDog.strength + 2);
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.playCard(wasabiAlwaysPrepared);
//     Expect(cardUnderTest.strength).toBe(ladyDecisiveDog.strength + 3);
//     Expect(cardUnderTest.lore).toBe(3);
//
//     Const { shifter } = await testEngine.shiftCard({
//       Shifted: ladyDecisiveDog,
//       Shifter: ladyMissParkAvenue,
//     });
//     Await testEngine.skipTopOfStack();
//
//     Expect(shifter.lore).toBe(ladyMissParkAvenue.lore);
//     Expect(shifter.strength).toBe(ladyMissParkAvenue.strength + 3);
//   });
// });
//
