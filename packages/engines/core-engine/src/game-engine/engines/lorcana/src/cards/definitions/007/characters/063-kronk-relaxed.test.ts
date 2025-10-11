import { describe, expect, it } from "bun:test";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { suddenChill } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { kronkRelaxed } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kronk - Relaxed", () => {
  it("Ward", async () => {
    const testEngine = new TestEngine({
      play: [kronkRelaxed],
    });

    expect(testEngine.getCardModel(kronkRelaxed).hasWard).toBe(true);
  });

  it("I LOVE IT If an effect would make you discard one or more cards, don't discard any.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: suddenChill.cost,
        hand: [suddenChill],
      },
      {
        hand: [moanaOfMotunui],
        play: [kronkRelaxed],
      },
    );

    await testEngine.playCard(suddenChill);

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveTopOfStack({ targets: [moanaOfMotunui] });

    expect(testEngine.getCardModel(moanaOfMotunui).zone).toBe("hand");
  });
});
