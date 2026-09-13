import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";

import { blueFinHarpoonBlue } from "./blue-fin-harpoon.ts";

/**
 * Blue Fin Harpoon (SEA089) — Pirate Ranger Arrow. Blue cost 2, 4{p}/3{d}.
 * When this hits a hero, they reveal a card from hand. If it's blue, they discard it and you create Gold.
 */

describe("Blue Fin Harpoon (SEA089) AAA", () => {
  it("happy: hit reveals a blue card; they discard it and you create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: blueFinHarpoonBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(blueFinHarpoonBlue, { from: "arsenal" });
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 1);
  });

  it("boundary: a blocked miss does not reveal or create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: blueFinHarpoonBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(blueFinHarpoonBlue, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 0);
  });

  it("timing: revealing a non-blue card does not create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: blueFinHarpoonBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(blueFinHarpoonBlue, { from: "arsenal" });
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("hand")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 0);
  });
});
