import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { fang } from "../heroes/fang.ts";
import { forTheDracaiRed } from "../actions/for-the-dracai.ts";
import { coatOfAllegiance } from "./coat-of-allegiance.ts";

/**
 * Coat of Allegiance (FNG004) — Draconic Equipment Chest d0.
 *
 * Printed: Action - Destroy this: Gain {r}. Until end of turn, you may only
 * play cards that are Draconic. Go again.
 */

describe("Coat of Allegiance (FNG004) AAA", () => {
  it("happy: destroy this, gain {r}, then a Draconic card is still playable", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        chest: [coatOfAllegiance],
        hand: [forTheDracaiRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activate(coatOfAllegiance);
    game.helpers.resolveUntilIdle();

    expectFabCard(Fang, coatOfAllegiance).toBeIn("graveyard");
    expectFabPlayer(Fang).toHaveResourceCount(1);
    expectFabPlayer(Fang).toHaveAP(1);

    Fang.playAttack(forTheDracaiRed);
    expectFabCard(Fang, forTheDracaiRed).toBeIn("combatChain");
  });

  it("boundary: after activation a non-Draconic card cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        chest: [coatOfAllegiance],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activate(coatOfAllegiance);
    game.helpers.resolveUntilIdle();

    expect(() => Fang.playAttack(brutalAssaultBlue)).toThrow(/rules effect requires/i);
    expectFabCard(Fang, brutalAssaultBlue).toBeIn("hand");
  });

  it("timing: the Draconic-only restriction expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        chest: [coatOfAllegiance],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activate(coatOfAllegiance);
    game.helpers.resolveUntilIdle();
    Fang.endTurn();
    game.as(dash).endTurn();

    expectFabCard(Fang, brutalAssaultBlue).toBeIn("hand");
  });
});
