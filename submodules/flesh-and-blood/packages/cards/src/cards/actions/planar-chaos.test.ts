import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  fabToken,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { planarChaosRed } from "./planar-chaos.ts";
import { gateToIArathael } from "../tokens/gate-to-i-arathael.ts";
import { unboundByShadowRed } from "./unbound-by-shadow.ts";
describe("Planar Chaos preview behavior", () => {
  it("creates a Gate and lets its controller target and play an opponent's banished blood-debt action", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [planarChaosRed], resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], banished: [unboundByShadowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(chane);
    const foreign = game.as(dash).cardIn("banished", unboundByShadowRed);
    player.play(planarChaosRed);
    game.untilIdle();
    expectFabPlayer(player).toHaveAP(1).toHaveTokenCount("gate-to-i-arathael", 1);
    player.activate(fabToken("gate-to-i-arathael"));
    player.target(foreign);
    game.untilIdle();
    player.playAttack(foreign, { from: "banished" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
  it("extends only the next Gate activation, then restores controller-only targeting", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [planarChaosRed],
        arena: [gateToIArathael],
        banished: [unboundByShadowRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], banished: [unboundByShadowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(chane);
    const foreign = game.as(dash).cardIn("banished", unboundByShadowRed);
    const own = player.cardIn("banished", unboundByShadowRed);
    const originalGate = player.cardIn("arena", gateToIArathael);
    player.play(planarChaosRed);
    game.untilIdle();
    player.activate(originalGate);
    player.targetRequired(foreign);
    game.untilIdle();
    player.activate(fabToken("gate-to-i-arathael"));
    expect(() => player.targetRequired(foreign)).toThrow();
    player.targetRequired(own);
    game.untilIdle();
    player.playAttack(own, { from: "banished" });
    expectCombat(game).toHaveAttackPower(4);
  });
});
