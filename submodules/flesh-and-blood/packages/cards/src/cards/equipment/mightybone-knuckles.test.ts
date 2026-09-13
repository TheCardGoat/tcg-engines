import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { mightyboneKnuckles } from "./mightybone-knuckles.ts";

/**
 * Mightybone Knuckles (SUP080) — Reviled Arms d1 Blade Break.
 *
 * Printed: Action - {r}{r}{r}, destroy this: Create 3 Might tokens.
 * Activate this only if you have more {h} than each other hero. Go again
 */

describe("Mightybone Knuckles (SUP080) AAA", () => {
  it("happy: with more life, destroying this creates 3 Might tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [mightyboneKnuckles],
        hand: [],
        life: 40,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(mightyboneKnuckles);
    game.passBoth();

    expectFabCard(Bravo, mightyboneKnuckles).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 3).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("boundary: cannot activate when life is not greater than the other hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [mightyboneKnuckles],
        hand: [],
        life: 20,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(mightyboneKnuckles);
    expectFabCard(Bravo, mightyboneKnuckles).toBeIn("arms");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });

  it("timing: the created Might tokens are destroyed at the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [mightyboneKnuckles],
        hand: [],
        life: 40,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(mightyboneKnuckles);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("might", 3);

    Bravo.endTurn();
    Dash.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });
});
