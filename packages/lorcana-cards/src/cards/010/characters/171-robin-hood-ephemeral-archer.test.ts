// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { robinHoodEphemeralArcher } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Robin Hood - Ephemeral Archer", () => {
//   it("Boost 1 (Once during your turn, you may pay 1 to put the top card of your deck facedown under this character.) ", async () => {
//     const testEngine = new TestEngine({
//       play: [robinHoodEphemeralArcher],
//     });
//
//     expect(testEngine.getCardModel(robinHoodEphemeralArcher).hasBoost).toBe(
//       true,
//     );
//   });
//
//   it("EXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.", async () => {
//     const _testEngine = new TestEngine({
//       play: [robinHoodEphemeralArcher],
//     });
//   });
// });
//
