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

import { kingSharkHarpoonRed } from "./king-shark-harpoon.ts";

/**
 * King Shark Harpoon (SEA086) — Pirate Ranger Arrow. Red cost 2, 6{p}/3{d}.
 * When this hits a hero, they reveal a card from hand. If it's an attack action, they discard it and you create Gold.
 */

describe("King Shark Harpoon (SEA086) AAA", () => {
  it("happy: hit reveals an attack action; they discard it and you create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: kingSharkHarpoonRed, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(kingSharkHarpoonRed, { from: "arsenal" });
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 1);
  });

  it("boundary: a blocked miss does not reveal or create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: kingSharkHarpoonRed, state: { faceDown: false } }],
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

    Azalea.playAttack(kingSharkHarpoonRed, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 0);
  });

  it("timing: revealing a non-attack action does not create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: kingSharkHarpoonRed, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(kingSharkHarpoonRed, { from: "arsenal" });
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(14);
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 0);
  });
});
