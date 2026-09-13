import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { searingShotBlue } from "../actions/searing-shot.ts";
import { bullSEyeBracers } from "./bull-s-eye-bracers.ts";

/**
 * Bull's Eye Bracers (ARC042) — Ranger Arms d0, Arcane Barrier 1.
 * Printed: "Action - Destroy this: If you have no cards in your arsenal, you
 * may put an arrow from your hand face-up into your arsenal. It gets +1{p}
 * until end of turn. Go again"
 * Searing Shot (a real 0-cost 2{p} Arrow) rides the load; its hit rider only
 * matters in combat and is untouched here.
 */

describe("Bull's Eye Bracers (ARC042) AAA", () => {
  it("happy: destroying the bracers loads the arrow face-up with +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [bullSEyeBracers],
        hand: [searingShotBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(bullSEyeBracers);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, bullSEyeBracers).toBeIn("graveyard");
    expectFabCard(Azalea, searingShotBlue).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotBlue).toBeFaceUp();
    // Printed 2{p} plus the loaded "+1{p} until end of turn".
    expectFabCard(Azalea, searingShotBlue).toHavePower(3);
    // The activation's AP was refunded by the printed Go again.
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: declining the optional destroys the bracers but keeps the arrow in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [bullSEyeBracers],
        hand: [searingShotBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(bullSEyeBracers);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Azalea, bullSEyeBracers).toBeIn("graveyard");
    expectFabCard(Azalea, searingShotBlue).toBeIn("hand");
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: with a card already in the arsenal no arrow is loaded", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [bullSEyeBracers],
        hand: [searingShotBlue],
        arsenal: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(bullSEyeBracers);
    game.untilIdle();

    expectFabCard(Azalea, bullSEyeBracers).toBeIn("graveyard");
    expectFabCard(Azalea, snatchRed).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotBlue).toBeIn("hand");
    expectFabCard(Azalea, searingShotBlue).toHavePower(2);
  });

  it("timing: the loaded arrow's +1{p} expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [bullSEyeBracers],
        hand: [searingShotBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(bullSEyeBracers);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });
    expectFabCard(Azalea, searingShotBlue).toHavePower(3);

    Azalea.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Azalea, searingShotBlue).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotBlue).toBeFaceUp();
    expectFabCard(Azalea, searingShotBlue).toHavePower(2);
  });
});
