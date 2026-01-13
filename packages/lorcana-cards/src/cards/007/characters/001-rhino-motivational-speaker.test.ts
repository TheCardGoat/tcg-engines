// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { rhinoMotivationalSpeaker } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Rhino - Motivational Speaker", () => {
//   it.skip("DESTINY CALLING Your other characters get +2 {W}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: rhinoMotivationalSpeaker.cost,
//       play: [rhinoMotivationalSpeaker],
//       hand: [rhinoMotivationalSpeaker],
//     });
//
//     await testEngine.playCard(rhinoMotivationalSpeaker);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
