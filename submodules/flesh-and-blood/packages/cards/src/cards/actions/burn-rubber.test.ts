import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { throttleRed } from "./throttle.ts";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { nimblismBlue } from "./nimblism.ts";
import { burnRubberRed } from "./burn-rubber.ts";

describe("Burn Rubber (EVO154) AAA", () => {
  it("happy: after two boosts this is 7{p} and cannot be defended by equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [throttleRed, throttleRed, burnRubberRed, nimblismBlue, nimblismBlue],
        resourcePoints: 10,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, head: [ironrotHelm], hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);
    Teklo.play(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });
    Teklo.play(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });
    Teklo.playAttack(burnRubberRed);
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(21);
    expectFabCard(Dash, ironrotHelm).toBeIn("head");
  });

  it("boundary: without two boosts this stays 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [burnRubberRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).playAttack(burnRubberRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("timing: equipment may still defend when the boost gate is off", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [burnRubberRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, head: [ironrotHelm], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(teklovossen).playAttack(burnRubberRed);
    Dash.defendWith(ironrotHelm);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
