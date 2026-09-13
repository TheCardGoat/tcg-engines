import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { snatchRed } from "./snatch.ts";
import { bigBerthaRed } from "./big-bertha.ts";

/**
 * Big Bertha, Red (EVO177) — Mechanologist Action - Attack, cost 3, 6{p},
 * 3{d}, Boost.
 * Printed: "When this is banished from boosting, put a steam counter on a
 * Hyper Driver you control."
 */

describe("Big Bertha family AAA", () => {
  it("happy: banished from boosting, it charges a controlled Hyper Driver", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed],
        arena: [hyperDriverRed],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, bigBerthaRed],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("defend");

    expect(Dash.zone("banished")).toContain(bigBerthaRed.canonicalId);
    expectFabCard(Dash, hyperDriverRed).toHaveCounters(1, "steam");
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: an unboosted attack leaves this in the deck and the driver uncharged", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed],
        arena: [hyperDriverRed],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, bigBerthaRed],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(zeroToSixtyRed);
    game.advanceCombatTo("defend");

    expect(Dash.zone("deck")).toContain(bigBerthaRed.canonicalId);
    expectFabCard(Dash, hyperDriverRed).toHaveCounters(0, "steam");
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: the steam counter lands at the boost banish, before the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed],
        arena: [hyperDriverRed],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, bigBerthaRed],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(zeroToSixtyRed, { boost: true, stopAt: "on-attack" });
    game.untilIdle({ ordering: "listed", optionals: "decline" });

    expect(Dash.zone("banished")).toContain(bigBerthaRed.canonicalId);
    expectFabCard(Dash, hyperDriverRed).toHaveCounters(1, "steam");
  });
});
