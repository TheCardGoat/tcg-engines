// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { clarabelleNewsReporter } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Clarabelle - Journalist", () => {
//   It.skip("SUPPORT (When this character is sent on an adventure, you can add its {S} to that of another character of your choice for the rest of this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: clarabelleNewsReporter.cost,
//       Play: [clarabelleNewsReporter],
//       Hand: [clarabelleNewsReporter],
//     });
//
//     Await testEngine.playCard(clarabelleNewsReporter);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("SCOOP Your other characters with Support gain +1 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: clarabelleNewsReporter.cost,
//       Play: [clarabelleNewsReporter],
//       Hand: [clarabelleNewsReporter],
//     });
//
//     Await testEngine.playCard(clarabelleNewsReporter);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
