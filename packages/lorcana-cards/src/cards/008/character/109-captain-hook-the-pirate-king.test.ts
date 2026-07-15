// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { elsaQueenRegent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   CaptainHookForcefulDuelist,
//   CaptainHookThePirateKing,
//   DeweyLovableShowoff,
//   HueyReliableLeader,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Captain Hook - The Pirate King", () => {
//   It("SHIFT 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: captainHookThePirateKing.cost,
//       Play: [captainHookForcefulDuelist],
//       Hand: [captainHookThePirateKing],
//     });
//
//     Await testEngine.shiftCard({
//       Shifter: captainHookThePirateKing,
//       Shifted: captainHookForcefulDuelist,
//     });
//   });
//
//   Describe("GIVE 'EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)", () => {
//     It("should increase strength and grant resist to all Pirates when an opposing character is damaged", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: captainHookThePirateKing.cost,
//           Play: [
//             CaptainHookThePirateKing,
//             MrSmeeBumblingMate,
//             DeweyLovableShowoff,
//           ],
//         },
//         {
//           Play: [elsaQueenRegent],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(captainHookThePirateKing);
//       Const otherPirate = testEngine.getCardModel(mrSmeeBumblingMate);
//       Const noPirate = testEngine.getCardModel(deweyLovableShowoff);
//       Const oppoCard = testEngine.getCardModel(elsaQueenRegent);
//
//       TestEngine.setCardDamage(oppoCard, 1);
//
//       Expect(cardUnderTest.strength).toEqual(
//         CaptainHookThePirateKing.strength + 2,
//       );
//       Expect(otherPirate.strength).toEqual(mrSmeeBumblingMate.strength + 2);
//       Expect(noPirate.strength).toEqual(deweyLovableShowoff.strength);
//
//       Expect(cardUnderTest.hasResist).toEqual(true);
//       Expect(otherPirate.hasResist).toEqual(true);
//       Expect(noPirate.hasResist).toEqual(false);
//
//       // Verify happens only once per turn
//       TestEngine.setCardDamage(oppoCard, 2);
//
//       Expect(cardUnderTest.strength).toEqual(
//         CaptainHookThePirateKing.strength + 2,
//       );
//       Expect(otherPirate.strength).toEqual(mrSmeeBumblingMate.strength + 2);
//       Expect(noPirate.strength).toEqual(deweyLovableShowoff.strength);
//     });
//
//     It("should not increase strength during an opposing player's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [elsaQueenRegent],
//         },
//         {
//           Play: [
//             CaptainHookThePirateKing,
//             MrSmeeBumblingMate,
//             DeweyLovableShowoff,
//           ],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(captainHookThePirateKing);
//       Const otherPirate = testEngine.getCardModel(mrSmeeBumblingMate);
//       Const noPirate = testEngine.getCardModel(deweyLovableShowoff);
//       Const oppoCard = testEngine.getCardModel(elsaQueenRegent);
//
//       TestEngine.setCardDamage(oppoCard, 1);
//
//       Expect(cardUnderTest.strength).toEqual(captainHookThePirateKing.strength);
//       Expect(otherPirate.strength).toEqual(mrSmeeBumblingMate.strength);
//       Expect(noPirate.strength).toEqual(deweyLovableShowoff.strength);
//
//       Expect(cardUnderTest.hasResist).toEqual(false);
//       Expect(otherPirate.hasResist).toEqual(false);
//       Expect(noPirate.hasResist).toEqual(false);
//     });
//
//     It("challenging pirate should not gain resist before damage", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [captainHookThePirateKing, mrSmeeBumblingMate],
//         },
//         {
//           Play: [hueyReliableLeader],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(mrSmeeBumblingMate);
//       Const oppoCard = testEngine.getCardModel(hueyReliableLeader);
//
//       Await testEngine.challenge({
//         Attacker: cardUnderTest,
//         Defender: oppoCard,
//         ExertDefender: true,
//       });
//
//       // Smee should have 2 damage after the challenge (not 0 as though resist applied)
//       Expect(cardUnderTest.damage).toEqual(2);
//     });
//   });
// });
//
