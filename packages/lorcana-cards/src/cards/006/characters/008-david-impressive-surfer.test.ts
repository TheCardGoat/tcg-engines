// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { davidImpressiveSurfer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("David - Impressive Surfer", () => {
//   It.skip("SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: davidImpressiveSurfer.cost,
//       Play: [davidImpressiveSurfer],
//       Hand: [davidImpressiveSurfer],
//     });
//
//     Await testEngine.playCard(davidImpressiveSurfer);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
