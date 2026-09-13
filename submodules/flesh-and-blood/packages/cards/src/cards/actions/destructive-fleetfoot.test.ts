import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { destructiveFleetfootRed } from "./destructive-fleetfoot.ts";

describe("Destructive Fleetfoot (OMN062) AAA", () => {
  it("happy: a hit destroys an aura token they control", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [destructiveFleetfootRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("runechant")], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(destructiveFleetfootRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 0);
  });

  it("boundary: a miss does not destroy their aura token", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [destructiveFleetfootRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [fabToken("might")],
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(destructiveFleetfootRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });
});
