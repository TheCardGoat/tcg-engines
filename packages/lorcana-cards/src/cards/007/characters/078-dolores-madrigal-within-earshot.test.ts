// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { doloresMadrigalWithinEarshot } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dolores Madrigal - Within Earshot", () => {
//   it.skip("I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: doloresMadrigalWithinEarshot.cost,
//       play: [doloresMadrigalWithinEarshot],
//       hand: [doloresMadrigalWithinEarshot],
//     });
//
//     await testEngine.playCard(doloresMadrigalWithinEarshot);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
