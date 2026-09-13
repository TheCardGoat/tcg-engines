import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { harmonizedKodachi } from "./harmonized-kodachi.ts";
import { snatchRed } from "../actions/snatch.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";
import { quicksilverDagger } from "./quicksilver-dagger.ts";

/**
 * Quicksilver Dagger (DYN069) — Warrior 1H Dagger.
 *
 * If another weapon you control has gained go again this turn, this card's attacks get go again.
 */

describe("Quicksilver Dagger (DYN069) AAA", () => {
  it("happy: after another weapon gained go again, Quicksilver attacks get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [quicksilverDagger],
        weapon2: [harmonizedKodachi],
        pitch: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();
    Bravo.activate(quicksilverDagger);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: no other weapon gained go again — Quicksilver has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [quicksilverDagger],
        weapon2: [harmonizedKodachi],
        pitch: [unmovableRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();
    Bravo.activate(quicksilverDagger);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });
});
