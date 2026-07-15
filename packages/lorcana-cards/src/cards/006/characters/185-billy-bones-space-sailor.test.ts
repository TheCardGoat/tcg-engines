// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { billyBonesSpaceSailor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Billy Bones - Space Sailor", () => {
//   It.skip("KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: billyBonesSpaceSailor.cost,
//       Play: [billyBonesSpaceSailor],
//       Hand: [billyBonesSpaceSailor],
//     });
//
//     Await testEngine.playCard(billyBonesSpaceSailor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
