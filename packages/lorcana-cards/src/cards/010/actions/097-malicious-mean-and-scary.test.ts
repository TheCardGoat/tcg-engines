// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { maliciousMeanAndScary } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Malicious, Mean, and Scary", () => {
//   it.skip("Put 1 damage counter on each opposing character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: maliciousMeanAndScary.cost,
//       play: [maliciousMeanAndScary],
//       hand: [maliciousMeanAndScary],
//     });
//
//     await testEngine.playCard(maliciousMeanAndScary);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
