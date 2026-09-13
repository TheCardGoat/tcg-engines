import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { ravenousRabbleRed } from "../actions/ravenous-rabble.ts";
import { feistyLocalsRed } from "../actions/feisty-locals.ts";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { scarForAScarRed } from "../actions/scar-for-a-scar.ts";
import { katsu } from "../heroes/katsu.ts";
import { harmonizedKodachi } from "../weapons/harmonized-kodachi.ts";
import { razorReflexRed } from "../attack-reactions/razor-reflex.ts";
import { pummelRed } from "../attack-reactions/pummel.ts";
import { enlightenedStrikeRed } from "../actions/enlightened-strike.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { nimblismRed } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { unmovableBlue } from "../defense-reactions/unmovable.ts";
import { woundedBullYellow } from "../actions/wounded-bull.ts";
import { snagBlue } from "./snag.ts";

/**
 * Snag (CRU182) — Generic Instant, cost 0.
 *
 * Printed: Attack action cards can't gain {p} from their own effects, or the
 * effects of attack reaction cards this turn.
 */

describe("Snag (CRU182) AAA", () => {
  it("happy: Pummel cannot give an attack action +4{p} after Snag", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [snagBlue, brutalAssaultBlue, pummelRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.play(snagBlue);
    game.untilIdle();
    Bravo.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Bravo, snagBlue).toBeIn("graveyard");
  });

  it("boundary: without Snag, Pummel still gives the attack action +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [brutalAssaultBlue, pummelRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(8);
  });

  it("prevents Wounded Bull from gaining {p} from its own play trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [snagBlue, woundedBullYellow],
        resourcePoints: 3,
        actionPoints: 1,
        life: 15,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.play(snagBlue);
    game.untilIdle();
    Bravo.playAttack(woundedBullYellow);

    expectCombat(game).toHaveAttackPower(6);
  });

  it("prevents Enlightened Strike's chosen +2{p} mode", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [snagBlue, enlightenedStrikeRed, brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.play(snagBlue);
    game.untilIdle();
    Bravo.play(enlightenedStrikeRed, { modeIndexes: [1] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
  });

  it("prevents Feisty Locals from gaining {p} from its own while-effect", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [snagBlue, feistyLocalsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.play(snagBlue);
    game.untilIdle();
    Bravo.playAttack(feistyLocalsRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);

    expectCombat(game).toHaveAttackPower(3);
  });

  it("allows Nimblism's non-reaction effect to give an attack action +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [snagBlue, nimblismRed, scarForAScarRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.play(snagBlue);
    game.untilIdle();
    Bravo.play(nimblismRed);
    game.untilIdle();
    Bravo.playAttack(scarForAScarRed);

    expectCombat(game).toHaveAttackPower(7);
  });

  it("still allows an attack action to lose {p} from its own effect", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [snagBlue, ravenousRabbleRed],
        actionPoints: 1,
        deck: [brutalAssaultBlue],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.play(snagBlue);
    game.untilIdle();
    Bravo.playAttack(ravenousRabbleRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
  });

  it("prevents Razor Reflex's {p} but not its granted on-hit go again ability", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [snagBlue, scarForAScarRed, razorReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.play(snagBlue);
    game.untilIdle();
    Bravo.playAttack(scarForAScarRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(razorReflexRed, {
      modeIds: [`${razorReflexRed.canonicalId}:chooseMode:attackAction`],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("allows an attack reaction to give {p} to a weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [snagBlue, razorReflexRed],
        weapon1: [harmonizedKodachi],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.play(snagBlue);
    game.untilIdle();
    Katsu.activate(harmonizedKodachi);
    game.passBoth();
    game.toReaction("attacker");
    Katsu.must.playReaction(razorReflexRed, {
      modeIds: [`${razorReflexRed.canonicalId}:chooseMode:weapon`],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("removes an already-resolved Pummel gain while Snag remains in effect", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [brutalAssaultBlue, pummelRed, snagBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(8);

    Bravo.play(snagBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("lets the defending player stop the attacker's reaction gain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [brutalAssaultBlue, pummelRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snagBlue], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
    });
    Bravo.pass();
    Dash.play(snagBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("expires at end of turn so a later attack reaction can gain {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [snagBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, pummelRed, nimblismBlue, unmovableBlue],
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.play(snagBlue);
    game.untilIdle();
    Bravo.endTurn();
    game.untilIdle({ ordering: "listed" });

    Dash.attackWith(brutalAssaultBlue, { pitch: [nimblismBlue] });
    game.advanceCombatTo("reaction");
    Dash.must.playReaction(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
      pitch: [unmovableBlue],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(8);
  });

  it("timing: can be played on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      { hero: bravoShowstopper, hand: [snagBlue], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravoShowstopper);

    Dash.pass();
    Bravo.play(snagBlue);
    game.passBoth();

    expectFabCard(Bravo, snagBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(40);
  });
});
