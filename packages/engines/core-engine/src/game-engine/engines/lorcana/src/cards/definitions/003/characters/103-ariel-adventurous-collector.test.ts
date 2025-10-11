import { describe, expect, it } from "bun:test";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { arielAdventurousCollector } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
