// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { alistairKreiAmbitiousEntrepreneur } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Alistair Krei - Ambitious Entrepreneur", () => {
//   It.skip("AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: alistairKreiAmbitiousEntrepreneur.cost,
//       Hand: [alistairKreiAmbitiousEntrepreneur],
//     });
//
//     Await testEngine.playCard(alistairKreiAmbitiousEntrepreneur);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
