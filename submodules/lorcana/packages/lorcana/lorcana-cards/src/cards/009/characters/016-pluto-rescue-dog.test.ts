// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { plutoRescueDog } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pluto - Rescue Dog", () => {
//   It.skip("**TO THE RESCUE** When you play this character, you may remove up to 3 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: plutoRescueDog.cost,
//       Hand: [plutoRescueDog],
//     });
//
//     Await testEngine.playCard(plutoRescueDog);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
