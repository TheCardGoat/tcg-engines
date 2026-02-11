// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { arielAdventurousCollector } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ariel - Adventurous Collector", () => {
//   It("**Evasive** _(Only characters with Evasive can challenge this character.)_**INSPIRING VOICE** Whenever you play a song, chosen character of yours gains **Evasive** until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hakunaMatata.cost,
//       Play: [arielAdventurousCollector, liloGalacticHero],
//       Hand: [hakunaMatata],
//     });
//
//     Const songUnderTest = testEngine.getCardModel(hakunaMatata);
//     Const target = testEngine.getCardModel(liloGalacticHero);
//
//     Expect(target.hasEvasive).toBe(false);
//
//     Await testEngine.playCard(songUnderTest);
//
//     Await testEngine.resolveTopOfStack({ targets: [liloGalacticHero] });
//
//     Expect(target.hasEvasive).toBe(true);
//   });
// });
//
