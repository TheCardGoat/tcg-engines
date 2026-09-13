import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed } from "../actions/snatch.ts";
import { galvanicBender } from "./galvanic-bender.ts";

/**
 * Galvanic Bender (DYN089) — Mechanologist Arms d1 Battleworn.
 *
 * Printed: Material - While this is under a permanent, that permanent has
 * +1{p}. Battleworn
 *
 * Material is proved through the legal Construct Nitro Mechanoid flow in the
 * engine integration suite. These card-local boundaries cover its ordinary
 * equipment behavior without fixture-only hosting.
 */

describe("Galvanic Bender (DYN089) AAA", () => {
  it("boundary: equipped as Arms remains an ordinary equipment object", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [galvanicBender],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(snatchRed);
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Teklo, galvanicBender).toBeIn("arms");
  });

  it("timing: Battleworn puts −1{d} after this defends from Arms", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: teklovossen,
        arms: [galvanicBender],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Teklo = game.as(teklovossen);

    Dash.playAttack(snatchRed);
    Teklo.defendWith(galvanicBender);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, galvanicBender).toBeIn("arms");
    expectFabCard(Teklo, galvanicBender).toHaveDefenseCounters(-1);
  });
});
