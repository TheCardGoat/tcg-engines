// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CalhounBattletested,
//   ElsaTrustedSister,
//   MadamMimCheatingSpellcaster,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Calhoun - Battle-Tested", () => {
//   It("TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: calhounBattletested.cost,
//         Hand: [calhounBattletested, elsaTrustedSister],
//       },
//       {
//         Play: [madamMimCheatingSpellcaster],
//       },
//     );
//
//     Await testEngine.playCard(calhounBattletested);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [elsaTrustedSister] }, true);
//     Await testEngine.resolveTopOfStack({
//       Targets: [madamMimCheatingSpellcaster],
//     });
//
//     Expect(testEngine.getCardModel(elsaTrustedSister).zone).toBe("discard");
//     Expect(testEngine.getCardModel(madamMimCheatingSpellcaster).strength).toBe(
//       MadamMimCheatingSpellcaster.strength - 3,
//     );
//   });
// });
//
