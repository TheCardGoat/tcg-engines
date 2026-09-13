import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { mauvrionSkiesBlue } from "./mauvrion-skies.ts";
import { rushOfPowerRed } from "./rush-of-power.ts";

describe("Rush of Power (OMN068) AAA", () => {
  it("happy: with go again it gets +1{p} and deals 1 arcane on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [mauvrionSkiesBlue, rushOfPowerRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(mauvrionSkiesBlue);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(rushOfPowerRed);
    // Printed 3 + Quickstrike 1.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    // 4 physical + 1 arcane.
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: without go again it stays at 3{p} and still deals 1 arcane on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [rushOfPowerRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(rushOfPowerRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
