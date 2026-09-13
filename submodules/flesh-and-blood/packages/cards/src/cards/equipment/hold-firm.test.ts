import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { holdFirm } from "./hold-firm.ts";

/**
 * Hold Firm (SUP018) — Revered Arms d1 Blade Break.
 *
 * Printed: Action - {r}{r}, destroy this: Create 3 Toughness tokens.
 * Activate this only if you have less {h} than each other hero. Go again
 */

describe("Hold Firm (SUP018) AAA", () => {
  it("happy: with less life, destroying this creates 3 Toughness tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [holdFirm],
        hand: [],
        life: 20,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(holdFirm);
    game.passBoth();

    expectFabCard(Bravo, holdFirm).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("toughness", 3).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("toughness", 0);
  });

  it("boundary: cannot activate when life is not less than the other hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [holdFirm],
        hand: [],
        life: 40,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(holdFirm);
    expectFabCard(Bravo, holdFirm).toBeIn("arms");
    expectFabPlayer(Bravo).toHaveTokenCount("toughness", 0);
  });

  it("boundary: 1 resource cannot pay the Action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [holdFirm],
        hand: [],
        life: 20,
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(holdFirm);
    expectFabCard(Bravo, holdFirm).toBeIn("arms");
  });
});
