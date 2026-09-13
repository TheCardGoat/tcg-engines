import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { plundersongGloombladeRed } from "./plundersong-gloomblade.ts";
import { chane } from "../heroes/chane.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
describe("plundersong-gloomblade preview behavior", () => {
  for (const from of ["hand", "banished"] as const) {
    it(`hit from ${from} banishes the defender's arsenal card`, () => {
      const game = FabTestEngine.start(
        { hero: chane, hand: [], [from]: [plundersongGloombladeRed], resourcePoints: 0, deck: 6 },
        { hero: dash, hand: [], arsenal: [brutalAssaultBlue], life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(chane);
      player.playAttack(plundersongGloombladeRed, { from });
      game.as(dash).defendWith();
      game.closeCombat({ entityTargets: "maximum" });
      expectFabCard(game.as(dash), brutalAssaultBlue).toBeBanished();
      expectFabPlayer(game.as(dash)).toHaveLife(18);
    });
  }
  it("a fully defended attack does not banish a card", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [plundersongGloombladeRed], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], arsenal: [sinkBelowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(chane).playAttack(plundersongGloombladeRed);
    game.as(dash).defendWith(brutalAssaultBlue);
    game.closeCombat();
    expectFabCard(game.as(dash), sinkBelowRed).toBeIn("arsenal");
    expectFabCard(game.as(dash), brutalAssaultBlue).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
