import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { sprocketRocketRed } from "./sprocket-rocket.ts";

/**
 * Sprocket Rocket, Red (EVO192) — Mechanologist Action - Attack, cost 0,
 * 3{p}, 3{d}, Boost.
 * Printed: "Boost. If an item or equipment was banished from boosting this,
 * this gets +1{p}."
 */

describe("Sprocket Rocket (EVO192) AAA", () => {
  it("happy: boosting an item off the deck gives this +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [sprocketRocketRed],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, hyperDriverRed],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(sprocketRocketRed, { boost: true });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    expect(Teklo.zone("banished")).toContain(hyperDriverRed.canonicalId);
  });

  it("boundary: an unboosted attack stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [sprocketRocketRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(sprocketRocketRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: teklovossen,
        hand: [sprocketRocketRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Teklo = game.as(teklovossen);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Teklo.defendWith([sprocketRocketRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Teklo).toHaveLife(19);
    expectFabCard(Teklo, sprocketRocketRed).toBeIn("graveyard");
  });
});
