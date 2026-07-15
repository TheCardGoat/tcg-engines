// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyBraveLittleTailor,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { madamMimFox } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { hadesDoubleDealer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hades - Double Dealer", () => {
//   It("**GET DOWN TO BUSINESS** {E},  Banish chosen character of yours - Play another character from your hand with the same name.", () => {
//     Const testEngine = new TestEngine({
//       Play: [hadesDoubleDealer, mickeyBraveLittleTailor],
//       Hand: [mickeyMouseTrueFriend, madamMimFox],
//     });
//
//     TestEngine.activateCard(hadesDoubleDealer);
//     TestEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] }, true);
//     Expect(testEngine.getCardZone(mickeyBraveLittleTailor)).toBe("discard");
//
//     TestEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] }, true);
//     Expect(testEngine.getCardZone(mickeyMouseTrueFriend)).toBe("play");
//   });
//   It("Cannot play a character with a different name", () => {
//     Const testEngine = new TestEngine({
//       Play: [hadesDoubleDealer, mickeyBraveLittleTailor],
//       Hand: [mickeyMouseTrueFriend, madamMimFox],
//     });
//
//     TestEngine.activateCard(hadesDoubleDealer);
//     TestEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] }, true);
//     Expect(testEngine.getCardZone(mickeyBraveLittleTailor)).toBe("discard");
//
//     TestEngine.resolveTopOfStack({ targets: [madamMimFox] }, true);
//     Expect(testEngine.getCardZone(madamMimFox)).toBe("hand");
//   });
// });
//
