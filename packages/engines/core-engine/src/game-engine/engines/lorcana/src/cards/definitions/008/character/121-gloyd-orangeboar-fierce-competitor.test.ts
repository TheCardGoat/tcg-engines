/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { gloydOrangeboarFierceCompetitor } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gloyd Orangeboar - Fierce Competitor", () => {
  it("PUMPKIN SPICE When you play this character, each opponent loses 1 lore and you gain 1 lore.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: gloydOrangeboarFierceCompetitor.cost,
        hand: [gloydOrangeboarFierceCompetitor],
        lore: 5,
      },
      {
        lore: 5,
      },
    );

    await testEngine.playCard(gloydOrangeboarFierceCompetitor);

    expect(testEngine.getLoreForPlayer("player_one")).toEqual(6);
    expect(testEngine.getLoreForPlayer("player_two")).toEqual(4);
  });
});
