// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { jasmineDisguised } from "@lorcanito/lorcana-engine/cards/001/characters/148-jasmine-disguised";
// import { jasmineFearlessPrincess } from "@lorcanito/lorcana-engine/cards/009";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jasmine - Fearless Princess", () => {
//   it("TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     const testEngine = new TestEngine({
//       play: [jasmineFearlessPrincess],
//     });
//
//     expect(testEngine.getCardModel(jasmineFearlessPrincess).hasEvasive).toBe(
//       true,
//     );
//
//     await testEngine.passTurn();
//
//     expect(testEngine.getCardModel(jasmineFearlessPrincess).hasEvasive).toBe(
//       false,
//     );
//   });
//
//   it("NOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)", async () => {
//     const testEngine = new TestEngine({
//       play: [jasmineFearlessPrincess],
//       hand: [jasmineDisguised],
//     });
//
//     expect(testEngine.getCardModel(jasmineFearlessPrincess).hasChallenger).toBe(
//       false,
//     );
//
//     await testEngine.activateCard(jasmineFearlessPrincess, {
//       costs: [jasmineDisguised],
//     });
//
//     expect(testEngine.getCardModel(jasmineFearlessPrincess).hasChallenger).toBe(
//       true,
//     );
//   });
// });
//
