import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";

import { heraldOfJudgmentYellow } from "./herald-of-judgment.ts";

/**
 * Herald of Judgment (MON007) — Prism spec. Yellow cost 2, 6{p}/3{d}. Phantasm.
 * When this hits, put it into soul and the defending hero can't play cards from banished during their next action phase.
 */

describe("Herald of Judgment (MON007) AAA", () => {
  it("happy: when this hits, put it into soul", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfJudgmentYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfJudgmentYellow);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Prism, heraldOfJudgmentYellow).toBeIn("soul");
  });

  it("boundary: a blocked miss does not soul this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfJudgmentYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfJudgmentYellow);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Prism, heraldOfJudgmentYellow).toBeIn("graveyard");
  });

  it("timing: the defending hero cannot play from banished on their next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfJudgmentYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        banished: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfJudgmentYellow);
    game.closeCombat();
    Prism.endTurn();

    expect(() => Dash.attackWith(snatchRed, { from: "banished" })).toThrow();
    expectFabCard(Dash, snatchRed).toBeBanished();
  });
});
