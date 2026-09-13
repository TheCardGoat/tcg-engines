import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { stoneRainRed } from "./stone-rain.ts";

describe("Stone Rain (AAZ016) AAA", () => {
  it("happy: an aim counter grants dominate and face-down hand banish on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: stoneRainRed, state: { aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(stoneRainRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
  });

  it("boundary: without an aim counter a hit does not banish from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [stoneRainRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(stoneRainRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: the aimed hit-banish returns at their next end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: stoneRainRed, state: { aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(stoneRainRed, { from: "arsenal" });
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    Azalea.endTurn();
    Dash.endTurn();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });
});
