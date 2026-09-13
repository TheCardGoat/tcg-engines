import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import { dash } from "../heroes/dash.ts";
import { infectingShotBlue } from "./infecting-shot.ts";
import { nimblismBlue } from "./nimblism.ts";
import { blessingOfFocusRed } from "./blessing-of-focus.ts";

/**
 * Blessing of Focus (DYN159) — Ranger Action Aura.
 *
 * Printed: At the start of your turn, destroy this then Opt 3 and reveal the
 * top. If it's an arrow, put it face up into arsenal with an aim counter.
 *
 * Turn-1 end-phase draws the opponent to intellect, so seat a full hand and
 * fire on the controller's second start-phase.
 */

function startAzalea(deckTop: readonly FleshAndBloodCard[]) {
  return FabTestEngine.start(
    {
      hero: azalea,
      arena: [blessingOfFocusRed],
      hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      deckTop,
      life: 20,
    },
    { hero: dash, hand: [], life: 20, deck: 6 },
    FAB_MANUAL_HARNESS,
  );
}

function toAzaleaStartPhase(game: ReturnType<typeof FabTestEngine.start>) {
  game.as(azalea).endTurn();
  game.untilIdle();
  game.as(dash).endTurn();
  game.untilIdle({ ordering: "listed", optBottom: 0 });
}

describe("Blessing of Focus (DYN159) AAA", () => {
  it("happy: start of your turn destroys this, opts 3, then an arrow top goes face up into arsenal with an aim counter", () => {
    const game = startAzalea([nimblismBlue, nimblismBlue, infectingShotBlue]);
    const Azalea = game.as(azalea);

    toAzaleaStartPhase(game);

    expectFabCard(Azalea, blessingOfFocusRed).toBeIn("graveyard");
    expectFabCard(Azalea, infectingShotBlue).toBeIn("arsenal");
    expectFabCard(Azalea, infectingShotBlue).toHaveCounters(1, "aim");
  });

  it("boundary: a non-arrow top card is not put into arsenal", () => {
    const game = startAzalea([nimblismBlue, infectingShotBlue, nimblismBlue]);
    const Azalea = game.as(azalea);

    toAzaleaStartPhase(game);

    expectFabCard(Azalea, blessingOfFocusRed).toBeIn("graveyard");
    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arena: [blessingOfFocusRed],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deckTop: [infectingShotBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).endTurn();
    game.untilIdle();
    expectFabCard(game.as(azalea), blessingOfFocusRed).toBeIn("arena");
  });
});
