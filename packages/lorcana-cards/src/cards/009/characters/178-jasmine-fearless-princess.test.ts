// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jasmineDisguised } from "@lorcanito/lorcana-engine/cards/001/characters/148-jasmine-disguised";
// Import { jasmineFearlessPrincess } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jasmine - Fearless Princess", () => {
//   It("TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jasmineFearlessPrincess],
//     });
//
//     Expect(testEngine.getCardModel(jasmineFearlessPrincess).hasEvasive).toBe(
//       True,
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(jasmineFearlessPrincess).hasEvasive).toBe(
//       False,
//     );
//   });
//
//   It("NOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jasmineFearlessPrincess],
//       Hand: [jasmineDisguised],
//     });
//
//     Expect(testEngine.getCardModel(jasmineFearlessPrincess).hasChallenger).toBe(
//       False,
//     );
//
//     Await testEngine.activateCard(jasmineFearlessPrincess, {
//       Costs: [jasmineDisguised],
//     });
//
//     Expect(testEngine.getCardModel(jasmineFearlessPrincess).hasChallenger).toBe(
//       True,
//     );
//   });
// });
//
