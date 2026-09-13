import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { zeroToFiftyRed } from "../actions/zero-to-fifty.ts";
import { hyperX3 } from "./hyper-x3.ts";

/**
 * Hyper-X3 (EVO011) — Mechanologist Head, Battleworn.
 * Printed: whenever you banish a Hyper Driver from boosting, put it under
 * this. Once per turn, when a Hyper Driver is put under this, if there are 3
 * or more Hyper Drivers under this, draw a card.
 */

describe("Hyper-X3 (EVO011) AAA", () => {
  it("happy: boosting a Hyper Driver puts it under this instead of banished", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [hyperX3],
        hand: [zeroToFiftyRed],
        deck: [hyperDriverRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToFiftyRed, { boost: true });
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    // Printed: the boosted Hyper Driver is put under this, not banished.
    expect(Teklo.zone("banished")).not.toContain(hyperDriverRed.canonicalId);
    expectFabCard(Teklo, hyperDriverRed).toBeUnder(hyperX3);
    expectFabCard(Teklo, hyperX3).toBeIn("head");
  });

  it("boundary: boosting a non-Hyper Driver leaves this empty underneath", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [hyperX3],
        hand: [zeroToFiftyRed],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToFiftyRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectFabPlayer(Teklo).toHaveHandCount(0);
  });

  it("timing: a single boosted Hyper Driver does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [hyperX3],
        hand: [zeroToFiftyRed],
        deck: [hyperDriverRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToFiftyRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Teklo).toHaveHandCount(0);
  });
});
