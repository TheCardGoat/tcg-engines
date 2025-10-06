/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  chemPurse,
  iceSpikes,
  jumbaJookibaCriticalScientist,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Ice Spikes", () => {
  it("HOLD STILL When you play this item, exert chosen opposing character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: iceSpikes.cost,
        hand: [iceSpikes],
      },
      {
        play: [jumbaJookibaCriticalScientist],
      },
    );

    await testEngine.playCard(iceSpikes);
    await testEngine.resolveTopOfStack({
      targets: [jumbaJookibaCriticalScientist],
    });
  });

  it("IT'S STUCK {E}, 1 {I} – Exert chosen opposing item. It can’t ready at the start of its next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 1,
        play: [iceSpikes],
      },
      {
        play: [chemPurse],
      },
    );

    await testEngine.activateCard(iceSpikes, { targets: [chemPurse] });

    expect(testEngine.getCardModel(iceSpikes).exerted).toBe(true);
    expect(testEngine.getCardModel(chemPurse).exerted).toBe(true);

    await testEngine.passTurn();

    expect(testEngine.getCardModel(chemPurse).exerted).toBe(true);
  });
});
