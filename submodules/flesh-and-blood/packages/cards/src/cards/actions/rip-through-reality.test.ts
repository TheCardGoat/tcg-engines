import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { zapBlue } from "./zap.ts";
import { snatchRed } from "./snatch.ts";
import { ripThroughRealityRed } from "./rip-through-reality.ts";

/**
 * Rip Through Reality, Red (CHN013) — go again if you dealt arcane this turn.
 */

describe("Rip Through Reality (CHN013) AAA", () => {
  it("playline: played from the banished zone at printed 4{p}, resolving normally to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [zapBlue],
        banished: [ripThroughRealityRed],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    // Zap deals 1 arcane damage to the opposing hero this turn, satisfying
    // the printed go-again condition of CHN013-a2.
    Chane.play(zapBlue, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(19);

    const apBeforeAttack = Chane.actionPoints();
    Chane.attackWith(ripThroughRealityRed, { from: "banished" });
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(15); // 19 − printed 4{p}
    // The a1 permission moved it off the banished zone; combat resolution
    // sends it to the graveyard like any other attack.
    expect(Chane.zone("graveyard")).toContain(ripThroughRealityRed.canonicalId);
    // Arcane damage was dealt this turn, so the action point refunds
    // (printed-true direction; see the pin test for the contrast).
    expectFabPlayer(Chane).toHaveAP(apBeforeAttack);
  });

  it("boundary: without arcane damage this turn there is no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [ripThroughRealityRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.attackWith(ripThroughRealityRed, { from: "banished" });
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Chane).toHaveAP(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [ripThroughRealityRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Chane.defendWith([ripThroughRealityRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Chane).toHaveLife(19);
    expect(Chane.zone("graveyard")).toContain(ripThroughRealityRed.canonicalId);
  });
});
