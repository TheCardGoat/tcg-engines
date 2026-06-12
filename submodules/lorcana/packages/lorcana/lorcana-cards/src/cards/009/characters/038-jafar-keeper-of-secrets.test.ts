// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jafarKeeperOfSecrets } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jafar - Keeper of Secrets", () => {
//   It.skip("**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jafarKeeperOfSecrets.cost,
//       Play: [jafarKeeperOfSecrets],
//       Hand: [jafarKeeperOfSecrets],
//     });
//
//     Await testEngine.playCard(jafarKeeperOfSecrets);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
