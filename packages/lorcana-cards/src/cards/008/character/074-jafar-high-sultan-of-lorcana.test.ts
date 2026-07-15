// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JafarHighSultanOfLorcana,
//   PalaceGuardSpectralSentry,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jafar - High Sultan of Lorcana", () => {
//   It("DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jafarHighSultanOfLorcana],
//       Hand: [palaceGuardSpectralSentry],
//     });
//
//     Await testEngine.questCard(jafarHighSultanOfLorcana);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getZonesCardCount().hand).toEqual(2);
//     Await testEngine.resolveTopOfStack({
//       Targets: [palaceGuardSpectralSentry],
//     });
//
//     Expect(testEngine.getCardModel(palaceGuardSpectralSentry).zone).toEqual(
//       "play",
//     );
//   });
// });
//
