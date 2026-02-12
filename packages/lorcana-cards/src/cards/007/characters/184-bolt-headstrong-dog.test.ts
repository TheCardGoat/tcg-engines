// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { boltHeadstrongDog } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bolt - Headstrong Dog", () => {
//   It.skip("THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: boltHeadstrongDog.cost,
//       Play: [boltHeadstrongDog],
//       Hand: [boltHeadstrongDog],
//     });
//
//     Await testEngine.playCard(boltHeadstrongDog);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
