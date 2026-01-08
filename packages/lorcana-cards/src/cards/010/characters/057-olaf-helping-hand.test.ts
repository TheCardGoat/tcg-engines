// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import {
//   mickeyMouseDetective,
//   olafHelpingHand,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Olaf - Helping Hand", () => {
//   it("SECOND CHANCE - Should trigger when character is banished", async () => {
//     const testEngine = new TestEngine({
//       inkwell: smash.cost,
//       play: [olafHelpingHand, deweyLovableShowoff],
//       hand: [smash],
//     });
//
//     const olaf = testEngine.getCardModel(olafHelpingHand);
//     const dewey = testEngine.getCardModel(deweyLovableShowoff);
//
//     expect(olaf.zone).toBe("play");
//     expect(dewey.zone).toBe("play");
//
//     // Banish Olaf with Smash
//     await testEngine.playCard(smash, { targets: [olaf] }, true);
//
//     // Olaf is banished
//     expect(olaf.zone).toBe("discard");
//
//     // SECOND CHANCE ability should trigger
//     expect(testEngine.store.stackLayerStore.layers).toHaveLength(1);
//
//     // Accept the optional ability and choose Dewey to return to hand
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [dewey] });
//
//     // Dewey should be returned to hand
//     expect(dewey.zone).toBe("hand");
//   });
//
//   it("SECOND CHANCE - Should be optional", async () => {
//     const testEngine = new TestEngine({
//       inkwell: smash.cost,
//       play: [olafHelpingHand, deweyLovableShowoff],
//       hand: [smash],
//     });
//
//     const olaf = testEngine.getCardModel(olafHelpingHand);
//     const dewey = testEngine.getCardModel(deweyLovableShowoff);
//
//     expect(dewey.zone).toBe("play");
//
//     // Banish Olaf with Smash
//     await testEngine.playCard(smash, { targets: [olaf] }, true);
//
//     // Decline the optional ability
//     await testEngine.skipTopOfStack();
//
//     // Dewey should remain in play
//     expect(dewey.zone).toBe("play");
//   });
//
//   it("SECOND CHANCE - Should work when multiple characters in play", async () => {
//     const testEngine = new TestEngine({
//       inkwell: smash.cost,
//       play: [olafHelpingHand, deweyLovableShowoff, mickeyMouseDetective],
//       hand: [smash],
//     });
//
//     const olaf = testEngine.getCardModel(olafHelpingHand);
//     const dewey = testEngine.getCardModel(deweyLovableShowoff);
//     const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Use Smash to banish Olaf
//     await testEngine.playCard(smash, { targets: [olaf] }, true);
//
//     // Accept and choose Mickey to return to hand
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//     // Mickey should be in hand, Dewey still in play
//     expect(mickey.zone).toBe("hand");
//     expect(dewey.zone).toBe("play");
//     expect(olaf.zone).toBe("discard");
//   });
// });
//
