// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { balooFunLovingBear } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { kaaHypnotizingPython } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kaa - Hypnotizing Python", () => {
//   It("LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: kaaHypnotizingPython.cost,
//         Play: [kaaHypnotizingPython],
//       },
//       {
//         Play: [balooFunLovingBear],
//       },
//     );
//
//     Await testEngine.questCard(kaaHypnotizingPython, {
//       Targets: [balooFunLovingBear],
//     });
//
//     Expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(2);
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(2);
//     Expect(testEngine.getCardModel(balooFunLovingBear).hasReckless).toBe(true);
//     Await testEngine.challenge({
//       Attacker: balooFunLovingBear,
//       Defender: kaaHypnotizingPython,
//     });
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(4);
//     Expect(testEngine.getCardModel(balooFunLovingBear).hasReckless).toBe(false);
//   });
// });
//
