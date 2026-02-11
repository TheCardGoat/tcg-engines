// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { perditaDevotedMother } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { flynnRiderFrenemy } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Perdita - Devoted Mother", () => {
//   It("**COME ALONG, CHILDREN** When you play this character and whenever she quests, you may play a character with cost 2 or less from your discard for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: perditaDevotedMother.cost,
//       Hand: [perditaDevotedMother],
//       Discard: [flynnRiderFrenemy],
//     });
//
//     Await testEngine.playCard(perditaDevotedMother);
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({
//       Targets: [flynnRiderFrenemy],
//     });
//
//     Expect(testEngine.getCardModel(flynnRiderFrenemy).zone).toBe("play");
//   });
// });
//
