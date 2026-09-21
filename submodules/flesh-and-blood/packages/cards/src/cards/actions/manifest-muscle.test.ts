import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { riptide } from "../heroes/riptide.ts";
import { takeTheBaitRed } from "./take-the-bait.ts";
import { nimblismBlue } from "./nimblism.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { frostSpikeBlue } from "../instants/frost-spike.ts";
import { zen } from "../heroes/zen.ts";
import { spiritOfChristmasBlue } from "./spirit-of-christmas.ts";
import { snatchRed } from "./snatch.ts";
import { manifestMuscleBlue } from "./manifest-muscle.ts";

/**
 * Manifest Muscle, Blue (PEN270) — Mystic Action - Attack, cost 3, 5{p}, 3{d}.
 *
 * Printed: "If you've created a card this turn, this gets +1{p}."
 */

describe("Manifest Muscle (PEN270) AAA", () => {
  it("happy: after creating a Crouching Tiger this turn, this gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [spiritOfChristmasBlue, manifestMuscleBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(spiritOfChristmasBlue);
    game.untilIdle({ entityTargets: "minimum" });
    Zen.attackWith(manifestMuscleBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: without creating a card this turn, this stays printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [manifestMuscleBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(zen).attackWith(manifestMuscleBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zen, hand: [manifestMuscleBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Zen = game.as(zen);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Zen.defendWith([manifestMuscleBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(19);
    expectFabCard(Zen, manifestMuscleBlue).toBeIn("graveyard");
  });
});

// Runtime ownership interaction; constructed-deck restrictions are outside this
// campaign. All cards retain their printed properties and execute real moves.
describe("Manifest Muscle creator versus recipient", () => {
  it.each([
    { creates: true, power: 6, life: 14 },
    { creates: false, power: 5, life: 15 },
  ])("created under opponent control: $creates gives $power power", ({ creates, power, life }) => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: creates ? [takeTheBaitRed, manifestMuscleBlue] : [manifestMuscleBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);
    const Dash = game.as(dash);
    if (creates) {
      Riptide.play(takeTheBaitRed);
      game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
      expectFabPlayer(Dash).toHaveTokenCount("bait", 1);
      expectFabPlayer(Riptide).toHaveTokenCount("bait", 0).toHaveAP(1);
    }
    Riptide.playAttack(manifestMuscleBlue);
    expectCombat(game).toHaveAttackPower(power);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(life);
    expectFabPlayer(Riptide).toHaveAP(0);
    expectCombat(game).toBeClosed();
  });
  it("timing: creation on an earlier turn does not grant the bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [takeTheBaitRed, manifestMuscleBlue, nimblismBlue],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);
    const Dash = game.as(dash);
    Riptide.play(takeTheBaitRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveTokenCount("bait", 1);
    Riptide.endTurn();
    Dash.endTurn();
    Riptide.must.pitch(nimblismBlue).playAttack(manifestMuscleBlue);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(15).toHaveTokenCount("bait", 1);
    expectFabPlayer(Riptide).toHaveAP(0);
    expectCombat(game).toBeClosed();
  });

  it("recipient: receiving opponent-created Frostbites does not grant the bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [manifestMuscleBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: iyslander,
        hand: [frostSpikeBlue],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);
    const Iyslander = game.as(iyslander);
    Zen.pass();
    Iyslander.play(frostSpikeBlue);
    game.untilIdle();
    expectFabCard(Iyslander, frostSpikeBlue).toBeIn("graveyard");
    Zen.play(manifestMuscleBlue);
    // Both triggers destroy their own Frostbite; either order has the same result.
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Zen).toHaveResourceCount(0);
    game.closeCombat();
    expectFabPlayer(Iyslander).toHaveLife(15);
    expectFabPlayer(Zen).toHaveAP(0);
    expectCombat(game).toBeClosed();
  });
});
