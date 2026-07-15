// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   RayaInfiltrationExpert,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Raya - Infiltration Expert", () => {
//   It("UNCONVENTIONAL TACTICS Whenever this character quests, you may pay 2 {I} to ready another chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rayaInfiltrationExpert.cost,
//       Play: [rayaInfiltrationExpert, deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rayaInfiltrationExpert);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//     Target.exert();
//     Expect(target.ready).toEqual(false);
//
//     Await testEngine.questCard(cardUnderTest);
//     Await testEngine.resolveOptionalAbility();
//
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.ready).toEqual(true);
//   });
// });
//
