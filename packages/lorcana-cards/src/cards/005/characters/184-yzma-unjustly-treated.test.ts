// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyShowyNephew } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { yzmaUnjustlyTreated } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   CharlotteLaBouffMardiGrasPrincess,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yzma - Unjustly Treated", () => {
//   It("**I'M WARNING YOU!** During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.", () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: yzmaUnjustlyTreated.cost,
//         Play: [yzmaUnjustlyTreated, deweyLovableShowoff],
//       },
//       {
//         Play: [deweyShowyNephew, charlotteLaBouffMardiGrasPrincess],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(yzmaUnjustlyTreated);
//     Const oppoChalleng = testEngine.getCardModel(deweyShowyNephew);
//     Const targetEffect = testEngine.getCardModel(
//       CharlotteLaBouffMardiGrasPrincess,
//     );
//     Const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//     OppoChalleng.exert();
//
//     TestEngine.challenge({
//       Attacker: attacker,
//       Defender: oppoChalleng,
//     });
//
//     // Verify the opponent's character is banished
//     Expect(oppoChalleng.zone).toEqual("discard");
//
//     // Resolve Yzma's triggered ability
//     TestEngine.resolveOptionalAbility();
//     TestEngine.resolveTopOfStack({ targets: [targetEffect] });
//
//     // Target should receive 1 damage
//     Expect(targetEffect.damage).toEqual(1);
//   });
//
//   It("**I'M WARNING YOU!** Does not trigger when your character is banished", () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: yzmaUnjustlyTreated.cost,
//         Play: [yzmaUnjustlyTreated, deweyShowyNephew],
//       },
//       {
//         Play: [deweyLovableShowoff, charlotteLaBouffMardiGrasPrincess],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(yzmaUnjustlyTreated);
//     Const oppoChalleng = testEngine.getCardModel(deweyLovableShowoff);
//     Const targetEffect = testEngine.getCardModel(
//       CharlotteLaBouffMardiGrasPrincess,
//     );
//     Const attacker = testEngine.getCardModel(deweyShowyNephew);
//
//     OppoChalleng.exert();
//
//     TestEngine.challenge({
//       Attacker: attacker,
//       Defender: oppoChalleng,
//     });
//
//     // Verify our character is banished instead of opponent's
//     Expect(attacker.zone).toEqual("discard");
//
//     // No ability should trigger, stack should be empty
//     Expect(testEngine.stackLayers.length).toEqual(0);
//
//     // Target should not receive damage
//     Expect(targetEffect.damage).toEqual(0);
//   });
//
//   It("**I'M WARNING YOU!** Does not trigger during opponent's turn", () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: yzmaUnjustlyTreated.cost,
//         Play: [yzmaUnjustlyTreated, deweyShowyNephew],
//       },
//       {
//         Play: [deweyLovableShowoff, charlotteLaBouffMardiGrasPrincess],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(yzmaUnjustlyTreated);
//     Const oppoChalleng = testEngine.getCardModel(deweyShowyNephew);
//     Const targetEffect = testEngine.getCardModel(
//       CharlotteLaBouffMardiGrasPrincess,
//     );
//     Const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//     // Pass turn to opponent
//     TestEngine.passTurn();
//
//     OppoChalleng.exert();
//
//     TestEngine.challenge({
//       Attacker: attacker,
//       Defender: oppoChalleng,
//     });
//
//     // Verify opponent's attack banishes our character
//     Expect(oppoChalleng.zone).toEqual("discard");
//
//     // No ability should trigger, stack should be empty
//     Expect(testEngine.stackLayers.length).toEqual(0);
//
//     // Target should not receive damage
//     Expect(targetEffect.damage).toEqual(0);
//   });
// });
//
