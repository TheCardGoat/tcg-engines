// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { ursulaSeaWitch } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ursula - Sea Witch", () => {
//   It.skip("YOU'RE TOO LATE Whenever this character quests, chosen opposing character can't ready at the start of their next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: ursulaSeaWitch.cost,
//       Play: [ursulaSeaWitch],
//       Hand: [ursulaSeaWitch],
//     });
//
//     Await testEngine.playCard(ursulaSeaWitch);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
