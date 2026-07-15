// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { chiefBogoGazelleFan } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chief Bogo - Gazelle Fan", () => {
//   It.skip("YOU LIKE GAZELLE TOO? While you have a character named Gazelle in play, this character gains Singer 6. (He counts as cost 6 to sing songs.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: chiefBogoGazelleFan.cost,
//       Play: [chiefBogoGazelleFan],
//       Hand: [chiefBogoGazelleFan],
//     });
//
//     Await testEngine.playCard(chiefBogoGazelleFan);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
