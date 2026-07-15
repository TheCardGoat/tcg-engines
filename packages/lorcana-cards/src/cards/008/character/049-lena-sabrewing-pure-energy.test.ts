// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   LenaSabrewingPureEnergy,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lena Sabrewing - Pure Energy", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [lenaSabrewingPureEnergy],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(lenaSabrewingPureEnergy);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("SUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [lenaSabrewingPureEnergy],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(lenaSabrewingPureEnergy);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "SUPERNATURAL VENGEANCE",
//       Targets: [target],
//     });
//
//     Expect(target.damage).toBe(1);
//   });
// });
//
