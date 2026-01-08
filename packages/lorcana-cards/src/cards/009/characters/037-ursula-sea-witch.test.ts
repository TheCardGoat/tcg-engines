// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { ursulaSeaWitch } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ursula - Sea Witch", () => {
//   it.skip("YOU'RE TOO LATE Whenever this character quests, chosen opposing character can't ready at the start of their next turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: ursulaSeaWitch.cost,
//       play: [ursulaSeaWitch],
//       hand: [ursulaSeaWitch],
//     });
//
//     await testEngine.playCard(ursulaSeaWitch);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
