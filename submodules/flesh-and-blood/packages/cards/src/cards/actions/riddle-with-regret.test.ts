import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { riddleWithRegretRed } from "./riddle-with-regret.ts";

/**
 * Riddle with Regret (SEA256) — Chaos Action Aura, go again.
 *
 * Printed: At the beginning of each hero's end phase, they lose X{h}, where
 * X is the number of auras they controlled when this triggered. If X is 3
 * or more, destroy this.
 *
 * X is that end-phase player's aura count (`player: turn-player`), never a
 * play-time `{ type: "x" }` binding.
 */

describe("Riddle with Regret (SEA256) AAA", () => {
  it("happy: 3 auras at the controller's end phase loses 3{h} and destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [riddleWithRegretRed],
        arena: [fabToken("spectral-shield"), fabToken("spectral-shield")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(riddleWithRegretRed);
    game.untilIdle({ ordering: "listed" });
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, riddleWithRegretRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: 1 aura loses 1{h} and does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [riddleWithRegretRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(riddleWithRegretRed);
    game.untilIdle({ ordering: "listed" });
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, riddleWithRegretRed).toBeIn("arena");
  });

  it("timing: the opponent's end phase taxes their auras, not the controller's", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [riddleWithRegretRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [
          fabToken("spectral-shield"),
          fabToken("spectral-shield"),
          fabToken("spectral-shield"),
        ],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(riddleWithRegretRed);
    game.untilIdle({ ordering: "listed" });
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, riddleWithRegretRed).toBeIn("arena");

    Dash.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Bravo, riddleWithRegretRed).toBeIn("graveyard");
  });
});
