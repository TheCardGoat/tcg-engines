import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { anothos } from "../weapons/anothos.ts";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";

import { limpitHopALongYellow } from "../actions/limpit-hop-a-long.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { pummelRed } from "./pummel.ts";

const modeId = (card: typeof pummelRed, mode: "weapon" | "hitHero") =>
  `${card.canonicalId}:chooseMode:${mode}`;

describe("Pummel family AAA", () => {
  it("happy: the weapon mode gives a hammer attack +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        weapon1: [anothos],
        hand: [pummelRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.activateAttack(anothos);
    game.toReaction("attacker");
    Bravo.must.playReaction(pummelRed, { modeIds: [modeId(pummelRed, "weapon")] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: the hit-hero mode gives a cost-2 attack +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [pummelRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Bravo.must.playReaction(pummelRed, { modeIds: [modeId(pummelRed, "hitHero")] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(8);
  });

  it("timing: a hit on a hero discards one card from that hero's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [pummelRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Bravo.must.playReaction(pummelRed, { modeIds: [modeId(pummelRed, "hitHero")] });
    game.passBoth();
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
  });

  it("erratum boundary: a hit on an ally does not discard from its controller's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [pummelRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        arena: [limpitHopALongYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.playAttack(brutalAssaultBlue, {
      target: Dash.ref(limpitHopALongYellow).instanceId,
    });
    game.toReaction("attacker");
    Bravo.must.playReaction(pummelRed, { modeIds: [modeId(pummelRed, "hitHero")] });
    game.passBoth();
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, limpitHopALongYellow).toBeIn("graveyard");
  });

  it("timing: a Pummel reaction is put into its controller's graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        weapon1: [anothos],
        hand: [pummelRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.activateAttack(anothos);
    game.toReaction("attacker");
    Bravo.must.playReaction(pummelRed, { modeIds: [modeId(pummelRed, "weapon")] });
    game.passBoth();

    expectFabCard(Bravo, pummelRed).toBeIn("graveyard");
  });
});
