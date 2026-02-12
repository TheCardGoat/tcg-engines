// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import {
//   MickeyMouseDetective,
//   OlafHelpingHand,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Olaf - Helping Hand", () => {
//   It("SECOND CHANCE - Should trigger when character is banished", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: smash.cost,
//       Play: [olafHelpingHand, deweyLovableShowoff],
//       Hand: [smash],
//     });
//
//     Const olaf = testEngine.getCardModel(olafHelpingHand);
//     Const dewey = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(olaf.zone).toBe("play");
//     Expect(dewey.zone).toBe("play");
//
//     // Banish Olaf with Smash
//     Await testEngine.playCard(smash, { targets: [olaf] }, true);
//
//     // Olaf is banished
//     Expect(olaf.zone).toBe("discard");
//
//     // SECOND CHANCE ability should trigger
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(1);
//
//     // Accept the optional ability and choose Dewey to return to hand
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [dewey] });
//
//     // Dewey should be returned to hand
//     Expect(dewey.zone).toBe("hand");
//   });
//
//   It("SECOND CHANCE - Should be optional", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: smash.cost,
//       Play: [olafHelpingHand, deweyLovableShowoff],
//       Hand: [smash],
//     });
//
//     Const olaf = testEngine.getCardModel(olafHelpingHand);
//     Const dewey = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(dewey.zone).toBe("play");
//
//     // Banish Olaf with Smash
//     Await testEngine.playCard(smash, { targets: [olaf] }, true);
//
//     // Decline the optional ability
//     Await testEngine.skipTopOfStack();
//
//     // Dewey should remain in play
//     Expect(dewey.zone).toBe("play");
//   });
//
//   It("SECOND CHANCE - Should work when multiple characters in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: smash.cost,
//       Play: [olafHelpingHand, deweyLovableShowoff, mickeyMouseDetective],
//       Hand: [smash],
//     });
//
//     Const olaf = testEngine.getCardModel(olafHelpingHand);
//     Const dewey = testEngine.getCardModel(deweyLovableShowoff);
//     Const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Use Smash to banish Olaf
//     Await testEngine.playCard(smash, { targets: [olaf] }, true);
//
//     // Accept and choose Mickey to return to hand
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//     // Mickey should be in hand, Dewey still in play
//     Expect(mickey.zone).toBe("hand");
//     Expect(dewey.zone).toBe("play");
//     Expect(olaf.zone).toBe("discard");
//   });
// });
//
