import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";
import { harmonizedKodachi } from "./harmonized-kodachi.ts";

/**
 * Harmonized Kodachi (KSU003) — Ninja 1H Dagger.
 *
 * If you have a card in your pitch zone with cost 0, this card's attacks get go again.
 */

describe("Harmonized Kodachi (KSU003) AAA", () => {
  it("happy: cost-0 in pitch — Kodachi attacks get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [harmonizedKodachi],
        pitch: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.activate(harmonizedKodachi);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(1);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: no cost-0 in pitch — Kodachi has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [harmonizedKodachi],
        pitch: [unmovableRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.activate(harmonizedKodachi);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });
});
