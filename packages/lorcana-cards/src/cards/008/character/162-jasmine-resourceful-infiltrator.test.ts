// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinVigilantGuard,
//   JasmineResourcefulInfiltrator,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jasmine - Resourceful Infiltrator", () => {
//   It("JUST WHAT YOU NEED When you play this character, you may give another chosen character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jasmineResourcefulInfiltrator.cost,
//       Hand: [jasmineResourcefulInfiltrator],
//       Play: [aladdinVigilantGuard],
//     });
//
//     Await testEngine.playCard(jasmineResourcefulInfiltrator);
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [aladdinVigilantGuard],
//     });
//
//     Expect(testEngine.getCardModel(aladdinVigilantGuard).hasResist).toBe(true);
//   });
// });
//
