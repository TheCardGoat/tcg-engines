import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evoBetaBaseHeadBlue } from "./evo-beta-base-head.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { heavyMetalHardcoreRed } from "./heavy-metal-hardcore.ts";

describe("Heavy Metal Hardcore family AAA", () => {
  it("happy: +1{p} if an Evo was banished from boosting this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [heavyMetalHardcoreRed],
        deck: [evoBetaBaseHeadBlue],
        actionPoints: 1,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(heavyMetalHardcoreRed, { boost: true });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: without an Evo banished from boosting this stays at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [heavyMetalHardcoreRed],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(heavyMetalHardcoreRed, { boost: true });
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });
});
