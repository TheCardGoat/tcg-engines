import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { electrifyRed as electrify } from "../actions/electrify.ts";
import { aurora } from "../heroes/aurora.ts";
import { starFall } from "./star-fall.ts";

describe("Star Fall (AUR002) AAA", () => {
  it("happy: after a Lightning card, attacks for 2 with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        weapon1: [starFall],
        hand: [electrify],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);

    Aurora.must.play(electrify);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Aurora.activate(starFall);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: without a Lightning card, attacks for 1 and has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        weapon1: [starFall],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);

    Aurora.activate(starFall);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });
});
