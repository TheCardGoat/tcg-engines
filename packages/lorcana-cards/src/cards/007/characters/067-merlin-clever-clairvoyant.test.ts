// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { merlinCleverClairvoyant } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Merlin - Clever Clairvoyant", () => {
//   it.skip("PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: merlinCleverClairvoyant.cost,
//       play: [merlinCleverClairvoyant],
//       hand: [merlinCleverClairvoyant],
//     });
//
//     await testEngine.playCard(merlinCleverClairvoyant);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
