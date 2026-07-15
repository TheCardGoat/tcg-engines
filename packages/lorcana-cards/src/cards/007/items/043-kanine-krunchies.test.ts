// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KanineKrunchies,
//   KashekimAncientRuler,
//   LuckyRuntOfTheLitter,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kanine Krunchies", () => {
//   It("YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [kanineKrunchies, kashekimAncientRuler, luckyRuntOfTheLitter],
//     });
//
//     Expect(testEngine.getCardModel(luckyRuntOfTheLitter).willpower).toBe(
//       LuckyRuntOfTheLitter.willpower + 1,
//     );
//     Expect(testEngine.getCardModel(kashekimAncientRuler).willpower).toBe(
//       LuckyRuntOfTheLitter.willpower,
//     );
//   });
// });
//
