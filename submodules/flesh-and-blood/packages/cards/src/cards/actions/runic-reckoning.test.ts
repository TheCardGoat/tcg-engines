import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { rushOfPowerYellow } from "./rush-of-power.ts";
import { runeragerSwarmRed } from "./runerager-swarm.ts";
import { runicReckoningRed } from "./runic-reckoning.ts";

/**
 * Runic Reckoning (DTD213) — Runeblade Action, cost 1, go again.
 *
 * Printed: "This costs {r} less to play for each Runechant you control.
 * The next Runeblade attack action card you play this turn gets +3{p}.
 * Go again"
 *
 * Self-cost static matches Ninth Blade (ARC082). The +3{p} latch matches
 * Oath of the Arknight: Rush of Power (base 2) reads 5; Generic Snatch stays
 * 4 and does not consume; Runerager Swarm after the first Runeblade is base 3.
 */

const runechant = fabToken("runechant");

describe("Runic Reckoning (DTD213) AAA", () => {
  it("happy: 1 Runechant plays this for 0{r} and the next Runeblade attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runicReckoningRed, rushOfPowerYellow],
        arena: [runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(runicReckoningRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(1).toHaveResourceCount(0);

    Briar.must.playAttack(rushOfPowerYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a Generic attack gets nothing and does not consume the modifier", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runicReckoningRed, snatchRed, rushOfPowerYellow],
        arena: [runechant],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(runicReckoningRed);
    game.helpers.resolveUntilIdle();

    Briar.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);

    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    Briar.must.playAttack(rushOfPowerYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: the modifier is consumed by the first Runeblade attack; 0 Runechants cannot pay 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runicReckoningRed, rushOfPowerYellow, runeragerSwarmRed],
        arena: [runechant],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(runicReckoningRed);
    game.helpers.resolveUntilIdle();

    Briar.must.playAttack(rushOfPowerYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);

    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    Briar.must.playAttack(runeragerSwarmRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: with no Runechants the 1{r} cost is unpayable at 0{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runicReckoningRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(briar).play(runicReckoningRed)).toThrow();
    expectFabPlayer(game.as(briar)).toHaveResourceCount(0);
  });
});
