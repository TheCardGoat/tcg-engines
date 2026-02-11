// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { iagoReappearingParrot } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Iago - Reappearing Parrot", () => {
//   It.skip("GUESS WHO When this character is banished in a challenge, return this card to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: iagoReappearingParrot.cost,
//       Play: [iagoReappearingParrot],
//       Hand: [iagoReappearingParrot],
//     });
//
//     Await testEngine.playCard(iagoReappearingParrot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
