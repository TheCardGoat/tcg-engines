// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { doloresMadrigalWithinEarshot } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dolores Madrigal - Within Earshot", () => {
//   It.skip("I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: doloresMadrigalWithinEarshot.cost,
//       Play: [doloresMadrigalWithinEarshot],
//       Hand: [doloresMadrigalWithinEarshot],
//     });
//
//     Await testEngine.playCard(doloresMadrigalWithinEarshot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
