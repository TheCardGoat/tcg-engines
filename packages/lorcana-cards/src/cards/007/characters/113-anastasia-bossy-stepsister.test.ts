// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { anastasiaBossyStepsister } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Anastasia - Bossy Stepsister", () => {
//   It.skip("OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: anastasiaBossyStepsister.cost,
//       Play: [anastasiaBossyStepsister],
//       Hand: [anastasiaBossyStepsister],
//     });
//
//     Await testEngine.playCard(anastasiaBossyStepsister);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
