import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { earthFormBlue } from "../actions/earth-form.ts";
import { holdFocus } from "./hold-focus.ts";

/**
 * Hold Focus — Wizard Arms d0.
 *
 * Printed: "Action - Destroy this: Amp 1. Go again"
 *
 * Amp 1 raises the next arcane damage the controller deals this turn by 1.
 */
describe("Hold Focus AAA", () => {
  it("happy: destroying the hold amps the next bolt for +1 (5 arcane becomes 6)", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        life: 20,
        arms: [holdFocus],
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(holdFocus);
    game.untilIdle();
    // Destroy-self cost paid; go again refunded the Action point.
    expectFabCard(Kano, holdFocus).toBeIn("graveyard");
    expectFabPlayer(Kano).toHaveAP(1);

    Kano.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(14); // 20 − (5 + 1 amp)
  });

  it("boundary: without the amp latch, the same bolt deals its printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        life: 20,
        arms: [holdFocus],
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15); // 20 − 5, hold unactivated
    expectFabCard(Kano, holdFocus).toBeIn("arms");
  });

  it("timing: the amp lasts this turn only — the next turn's bolt is back to 5", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        life: 20,
        arms: [holdFocus],
        hand: [nimblismBlue, earthFormBlue], // turn-2 pitch fodder for the bolt
        deckTop: [volticBoltRed], // drawn for the second turn
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(holdFocus);
    game.untilIdle();
    Kano.endTurn();
    game.untilIdle();
    Dash.endTurn();
    game.untilIdle();

    Kano.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15); // amp expired with the old turn
  });
});
