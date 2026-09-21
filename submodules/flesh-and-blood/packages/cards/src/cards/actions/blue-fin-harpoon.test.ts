import { describe, expect, it } from "vitest";
import {
  expectFabCard,
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

  it("seat: the hit hero reveals their own pick and the revealed card is the one discarded", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: blueFinHarpoonBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(blueFinHarpoonBlue, { from: "arsenal" });
    // "they choose and reveal a card from their hand" — Dash is asked.
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(nimblismBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard"); // the revealed card
    expectFabCard(Dash, snatchRed).toBeIn("hand"); // not a fresh controller pick
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 1);
  });

  it("seat: a non-matching reveal discards nothing — not a free controller pick", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: blueFinHarpoonBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(blueFinHarpoonBlue, { from: "arsenal" });
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(snatchRed); // red revealed — Go Fish misses
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveHandCount(2); // nothing leaves the hand
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 0);
  });
});
