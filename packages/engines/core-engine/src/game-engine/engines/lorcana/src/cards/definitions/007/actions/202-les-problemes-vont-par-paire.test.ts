import { describe, expect, it } from "bun:test";
import {
  aladdinHeroicOutlaw,
  moanaOfMotunui,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { doubleTrouble } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Les Problemes Vont Par Paire", () => {
  it("Deal 1 damage to up to 2 chosen characters", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: doubleTrouble.cost,
        hand: [doubleTrouble],
      },
      {
        play: [aladdinHeroicOutlaw, moanaOfMotunui],
      },
    );

    await testEngine.playCard(doubleTrouble, {
      targets: [
        testEngine.getCardModel(aladdinHeroicOutlaw),
        testEngine.getCardModel(moanaOfMotunui),
      ],
    });

    expect(testEngine.getCardModel(aladdinHeroicOutlaw).damage).toBe(1);
    expect(testEngine.getCardModel(moanaOfMotunui).damage).toBe(1);
  });
});
