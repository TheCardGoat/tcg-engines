import { describe, expect, it } from "bun:test";
import { mickeyMouseMusketeer } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { elsasIcePalacePlaceOfSolitude } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Elsa's Ice Palace - Place of Solitude", () => {
  it("**ETERNAL WINTER** When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: elsasIcePalacePlaceOfSolitude.cost,
        hand: [elsasIcePalacePlaceOfSolitude],
      },
      {
        play: [mickeyMouseMusketeer],
      },
    );

    await testEngine.exertCard(mickeyMouseMusketeer);
    await testEngine.playCard(elsasIcePalacePlaceOfSolitude);

    await testEngine.resolveTopOfStack({
      targets: [mickeyMouseMusketeer],
    });

    await testEngine.passTurn();

    expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);

    await testEngine.passTurn();
    await testEngine.passTurn();

    expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);

    await testEngine.passTurn();
    await testEngine.passTurn();

    expect(testEngine.getCardModel(mickeyMouseMusketeer).ready).toBe(false);
  });
});
