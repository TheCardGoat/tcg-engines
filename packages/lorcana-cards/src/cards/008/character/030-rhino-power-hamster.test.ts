// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { agustinMadrigalClumsyDad } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { vanellopeVonSchweetzSugarRushChamp } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { rhinoPowerHamster } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rhino - Power Hamster", () => {
//   It("Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Rhino.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [rhinoPowerHamster],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rhinoPowerHamster);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("EPIC BALL OF AWESOME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rhinoPowerHamster.cost,
//       Play: [rhinoPowerHamster],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(rhinoPowerHamster).hasResist).toBe(true);
//   });
//
//   It("EPIC BALL OF AWESOME While this character has damage, he does not have resist", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rhinoPowerHamster.cost,
//       Play: [rhinoPowerHamster],
//       Hand: [],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rhinoPowerHamster);
//     TestEngine.setCardDamage(cardUnderTest, 1);
//
//     Expect(testEngine.getCardModel(rhinoPowerHamster).hasResist).toBe(false);
//   });
//
//   It("EPIC BALL OF AWESOME While this character has damage, he does not have resist", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: rhinoPowerHamster.cost,
//         Play: [rhinoPowerHamster],
//         Hand: [],
//       },
//       {
//         Play: [vanellopeVonSchweetzSugarRushChamp, agustinMadrigalClumsyDad],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(rhinoPowerHamster);
//     Const oppoChar1 = testEngine.getCardModel(
//       VanellopeVonSchweetzSugarRushChamp,
//     );
//     Const oppoChar2 = testEngine.getCardModel(agustinMadrigalClumsyDad);
//     // testEngine.setCardDamage(cardUnderTest, 1);
//
//     Expect(cardUnderTest.hasResist).toBe(true);
//     CardUnderTest.exert();
//
//     TestEngine.passTurn();
//
//     TestEngine.challenge({
//       Attacker: oppoChar1,
//       Defender: cardUnderTest,
//     });
//
//     Expect(cardUnderTest.hasResist).toBe(true);
//     Expect(cardUnderTest.damage).toBe(0);
//
//     TestEngine.challenge({
//       Attacker: oppoChar2,
//       Defender: cardUnderTest,
//     });
//
//     Expect(cardUnderTest.hasResist).toBe(true);
//     Expect(cardUnderTest.damage).toBe(0);
//   });
// });
//
