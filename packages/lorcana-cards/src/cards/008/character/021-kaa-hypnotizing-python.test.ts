// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { balooFunLovingBear } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { kaaHypnotizingPython } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Kaa - Hypnotizing Python", () => {
//   it("LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: kaaHypnotizingPython.cost,
//         play: [kaaHypnotizingPython],
//       },
//       {
//         play: [balooFunLovingBear],
//       },
//     );
//
//     await testEngine.questCard(kaaHypnotizingPython, {
//       targets: [balooFunLovingBear],
//     });
//
//     expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(2);
//     await testEngine.passTurn();
//
//     expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(2);
//     expect(testEngine.getCardModel(balooFunLovingBear).hasReckless).toBe(true);
//     await testEngine.challenge({
//       attacker: balooFunLovingBear,
//       defender: kaaHypnotizingPython,
//     });
//
//     await testEngine.passTurn();
//
//     expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(4);
//     expect(testEngine.getCardModel(balooFunLovingBear).hasReckless).toBe(false);
//   });
// });
//
