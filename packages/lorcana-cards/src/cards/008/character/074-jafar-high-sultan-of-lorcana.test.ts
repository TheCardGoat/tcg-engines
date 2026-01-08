// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   jafarHighSultanOfLorcana,
//   palaceGuardSpectralSentry,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jafar - High Sultan of Lorcana", () => {
//   it("DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.", async () => {
//     const testEngine = new TestEngine({
//       play: [jafarHighSultanOfLorcana],
//       hand: [palaceGuardSpectralSentry],
//     });
//
//     await testEngine.questCard(jafarHighSultanOfLorcana);
//     await testEngine.acceptOptionalLayer();
//
//     expect(testEngine.getZonesCardCount().hand).toEqual(2);
//     await testEngine.resolveTopOfStack({
//       targets: [palaceGuardSpectralSentry],
//     });
//
//     expect(testEngine.getCardModel(palaceGuardSpectralSentry).zone).toEqual(
//       "play",
//     );
//   });
// });
//
