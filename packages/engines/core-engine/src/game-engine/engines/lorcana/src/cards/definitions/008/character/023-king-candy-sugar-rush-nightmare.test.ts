/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { wreckitRalphAdmiralUnderpants } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { candleheadDedicatedRacer } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  gloydOrangeboarFierceCompetitor,
  kingCandySugarRushNightmare,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("King Candy - Sugar Rush Nightmare", () => {
  it("A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: dragonFire.cost,
      play: [kingCandySugarRushNightmare],
      hand: [dragonFire],
      discard: [candleheadDedicatedRacer],
    });

    await testEngine.playCard(
      dragonFire,
      {
        targets: [kingCandySugarRushNightmare],
      },
      true,
    );
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [candleheadDedicatedRacer] });

    expect(testEngine.getCardModel(candleheadDedicatedRacer).zone).toBe("hand");
  });

  it("A NEW ROSTER Only racers return", async () => {
    const testEngine = new TestEngine({
      inkwell: dragonFire.cost,
      play: [kingCandySugarRushNightmare],
      hand: [dragonFire],
      discard: [wreckitRalphAdmiralUnderpants, gloydOrangeboarFierceCompetitor],
    });

    await testEngine.playCard(
      dragonFire,
      {
        targets: [kingCandySugarRushNightmare],
      },
      true,
    );
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack(
      { targets: [wreckitRalphAdmiralUnderpants] },
      true,
    );

    expect(testEngine.getCardModel(wreckitRalphAdmiralUnderpants).zone).toBe(
      "discard",
    );
  });
});

describe("Regression tests", () => {
  it("Cannot Return Himself", async () => {
    const testEngine = new TestEngine({
      inkwell: dragonFire.cost,
      play: [kingCandySugarRushNightmare],
      hand: [dragonFire],
      discard: [],
    });

    await testEngine.playCard(
      dragonFire,
      {
        targets: [kingCandySugarRushNightmare],
      },
      true,
    );

    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.getCardModel(kingCandySugarRushNightmare).zone).toBe(
      "discard",
    );
  });
});
