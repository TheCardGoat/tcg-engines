// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FigaroTuxedoCat,
//   Scarab,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Figaro - Tuxedo Cat", () => {
//   It("PLAYFULNESS Opposing items enter play exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: scarab.cost,
//         Hand: [scarab],
//       },
//       {
//         Play: [figaroTuxedoCat],
//       },
//     );
//
//     Await testEngine.playCard(scarab);
//
//     Expect(testEngine.getCardModel(scarab).exerted).toEqual(true);
//   });
// });
//
