// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rhinoMotivationalSpeaker } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rhino - Motivational Speaker", () => {
//   It.skip("DESTINY CALLING Your other characters get +2 {W}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rhinoMotivationalSpeaker.cost,
//       Play: [rhinoMotivationalSpeaker],
//       Hand: [rhinoMotivationalSpeaker],
//     });
//
//     Await testEngine.playCard(rhinoMotivationalSpeaker);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
