import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { exposedBlue } from "../attack-reactions/exposed.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { twinningBladeYellow } from "../attack-reactions/twinning-blade.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { layLowYellow } from "./lay-low.ts";

/**
 * Lay Low (HNT236) — Generic Defense Reaction, 3{d}.
 * Printed: If you are marked, you can't play this. If the attacking hero is
 * marked, their next attack this turn gets -1{p}.
 */

describe("Lay Low (HNT236) AAA", () => {
  it("happy: plays as a 3{d} defense reaction", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [layLowYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(layLowYellow);
    game.passBoth();

    expectFabCard(Bravo, layLowYellow).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("happy: a marked attacking hero's next attack this turn gets -1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, marked: true, deck: 6 },
      { hero: bravo, hand: [layLowYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    const first = Dash.cardsIn("hand", snatchRed)[0]!;
    Dash.playAttack(first);
    game.toReaction("defender");
    // The attacking hero (Dash) is already marked as Lay Low resolves, so the
    // -1{p} latch arms for his next attack this turn.
    Bravo.must.playReaction(layLowYellow);
    game.helpers.resolveRestOfCombat();

    const second = Dash.cardsIn("hand", snatchRed)[0]!;
    Dash.playAttack(second);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();
  });

  it("boundary: the next-attack penalty does not follow a weapon into a later attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [{ card: dawnblade, state: { powerCounterTotal: 1 } }],
        hand: [twinningBladeYellow],
        resourcePoints: 5,
        actionPoints: 3,
        marked: true,
        deck: 6,
      },
      { hero: bravo, hand: [layLowYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Bravo = game.as(bravo);

    // The first Dawnblade attack arms Lay Low. Twinning Blade and Dorinthea's
    // first-weapon-hit permission (CR 5.2.3c) raise the activation limit
    // automatically — they are not optional booleans.
    Dori.must.activate(dawnblade);
    game.toReaction("defender");
    Bravo.must.playReaction(layLowYellow);
    Bravo.pass();
    Dori.must.playReaction(twinningBladeYellow);
    game.helpers.resolveRestOfCombat();

    Dori.must.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3); // base 3 + one counter - Lay Low's 1
    game.helpers.resolveRestOfCombat();

    Dori.must.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("defend");
    // Dawnblade now has two counters after its second hit. Lay Low expired with
    // the prior attack proxy, so this later activation is not reduced again.
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a marked hero cannot play this", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [layLowYellow], marked: true, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    expectFabUnplayable(
      () => Bravo.play(layLowYellow),
      /cannot be played|not legal|play condition/i,
    );
    expectFabCard(Bravo, layLowYellow).toBeIn("hand");
  });

  it("boundary: marking the defender does not reduce the attacker's follow-up this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, exposedBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [layLowYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    Dash.play(layLowYellow);
    Dash.pass();
    Bravo.play(exposedBlue);
    game.passBoth();
    game.passBoth();
    expectFabPlayer(Dash).toBeMarked();
    game.helpers.resolveRestOfCombat();

    Bravo.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: cannot play Lay Low outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [layLowYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    // Bravo is the turn player with priority in his own action phase, far
    // from any reaction step a defense reaction requires.
    expectFabUnplayable(
      () => game.as(bravo).play(layLowYellow),
      /cannot be played|not legal|reaction/i,
    );
    expectFabCard(game.as(bravo), layLowYellow).toBeIn("hand");
  });
});
