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

import { readTheGlidePathYellow } from "./read-the-glide-path.ts";
import { yellowFinHarpoonBlue } from "./yellow-fin-harpoon.ts";

/**
 * Yellow Fin Harpoon (SEA091) — Pirate Ranger Arrow. Blue cost 2, 4{p}/3{d}.
 * When this hits a hero, they reveal a card from hand. If it's yellow, they discard it and you create Gold.
 */

describe("Yellow Fin Harpoon (SEA091) AAA", () => {
  it("happy: hit reveals a yellow card; they discard it and you create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: yellowFinHarpoonBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [readTheGlidePathYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(yellowFinHarpoonBlue, { from: "arsenal" });
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 1);
  });

  it("boundary: a blocked miss does not reveal or create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: yellowFinHarpoonBlue, state: { faceDown: false } }],
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

    Azalea.playAttack(yellowFinHarpoonBlue, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 0);
  });

  it("timing: revealing a non-yellow card does not create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: yellowFinHarpoonBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(yellowFinHarpoonBlue, { from: "arsenal" });
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 0);
  });
});
