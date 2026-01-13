// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { davidImpressiveSurfer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("David - Impressive Surfer", () => {
//   it.skip("SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: davidImpressiveSurfer.cost,
//       play: [davidImpressiveSurfer],
//       hand: [davidImpressiveSurfer],
//     });
//
//     await testEngine.playCard(davidImpressiveSurfer);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
