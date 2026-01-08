// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { jafarKeeperOfSecrets } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jafar - Keeper of Secrets", () => {
//   it.skip("**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: jafarKeeperOfSecrets.cost,
//       play: [jafarKeeperOfSecrets],
//       hand: [jafarKeeperOfSecrets],
//     });
//
//     await testEngine.playCard(jafarKeeperOfSecrets);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
