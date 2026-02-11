// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { robinHoodEphemeralArcher } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Robin Hood - Ephemeral Archer", () => {
//   It("Boost 1 (Once during your turn, you may pay 1 to put the top card of your deck facedown under this character.) ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [robinHoodEphemeralArcher],
//     });
//
//     Expect(testEngine.getCardModel(robinHoodEphemeralArcher).hasBoost).toBe(
//       True,
//     );
//   });
//
//   It("EXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.", async () => {
//     Const _testEngine = new TestEngine({
//       Play: [robinHoodEphemeralArcher],
//     });
//   });
// });
//
