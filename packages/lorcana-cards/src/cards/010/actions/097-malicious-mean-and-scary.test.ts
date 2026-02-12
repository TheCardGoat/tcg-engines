// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { maliciousMeanAndScary } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Malicious, Mean, and Scary", () => {
//   It.skip("Put 1 damage counter on each opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: maliciousMeanAndScary.cost,
//       Play: [maliciousMeanAndScary],
//       Hand: [maliciousMeanAndScary],
//     });
//
//     Await testEngine.playCard(maliciousMeanAndScary);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
