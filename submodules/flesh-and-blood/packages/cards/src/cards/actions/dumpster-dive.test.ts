import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { fai } from "../heroes/fai.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { snatchRed } from "./snatch.ts";
import { dumpsterDiveRed } from "./dumpster-dive.ts";

/**
 * Dumpster Dive (EVO195) — Mechanologist Action - Attack, cost 1, 4{p}, 3{d},
 * Boost.
 * Printed: "Boost. If an item or equipment was banished from boosting this,
 * this gets +1{p}."
 */

describe("Dumpster Dive family AAA", () => {
  it("happy: boosting an item off the deck gives this +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [dumpsterDiveRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, grindingGearsBlue],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(dumpsterDiveRed, { boost: true });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    expect(Teklo.zone("banished")).toContain(grindingGearsBlue.canonicalId);
  });

  it("boundary: an unboosted attack stays printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [dumpsterDiveRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(dumpsterDiveRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [dumpsterDiveRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Teklo.defendWith([dumpsterDiveRed]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Teklo).toHaveLife(19);
    expectFabCard(Teklo, dumpsterDiveRed).toBeIn("graveyard");
  });
});
