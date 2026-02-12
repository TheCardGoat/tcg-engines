// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { merlinCleverClairvoyant } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Merlin - Clever Clairvoyant", () => {
//   It.skip("PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: merlinCleverClairvoyant.cost,
//       Play: [merlinCleverClairvoyant],
//       Hand: [merlinCleverClairvoyant],
//     });
//
//     Await testEngine.playCard(merlinCleverClairvoyant);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
