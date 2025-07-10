/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { kronkRelaxed } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
