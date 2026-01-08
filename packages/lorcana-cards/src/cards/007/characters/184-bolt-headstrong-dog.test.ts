// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { boltHeadstrongDog } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bolt - Headstrong Dog", () => {
//   it.skip("THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: boltHeadstrongDog.cost,
//       play: [boltHeadstrongDog],
//       hand: [boltHeadstrongDog],
//     });
//
//     await testEngine.playCard(boltHeadstrongDog);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
