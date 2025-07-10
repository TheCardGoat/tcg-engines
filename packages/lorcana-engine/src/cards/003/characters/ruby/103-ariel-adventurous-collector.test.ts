/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { arielAdventurousCollector } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Ariel - Adventurous Collector", () => {
  it("**Evasive** _(Only characters with Evasive can challenge this character.)_**INSPIRING VOICE** Whenever you play a song, chosen character of yours gains **Evasive** until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: hakunaMatata.cost,
      play: [arielAdventurousCollector, liloGalacticHero],
      hand: [hakunaMatata],
    });

    const songUnderTest = testEngine.getCardModel(hakunaMatata);
    const target = testEngine.getCardModel(liloGalacticHero);

    expect(target.hasEvasive).toBe(false);

    await testEngine.playCard(songUnderTest);

    await testEngine.resolveTopOfStack({ targets: [liloGalacticHero] });

    expect(target.hasEvasive).toBe(true);
  });
});
