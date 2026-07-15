// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AtlanteanCrystal,
//   RoquefortLockExpert,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Roquefort - Lock Expert", () => {
//   It("SAFEKEEPING Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: roquefortLockExpert.cost + 2,
//       Play: [roquefortLockExpert, atlanteanCrystal],
//     });
//     Const cardUnderTest = testEngine.getCardModel(roquefortLockExpert);
//     Const target = testEngine.getCardModel(atlanteanCrystal);
//     CardUnderTest.quest();
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     Expect(testEngine.getZonesCardCount().inkwell).toEqual(5);
//     Expect(testEngine.getCardModel(atlanteanCrystal).zone).toEqual("inkwell");
//   });
// });
//
