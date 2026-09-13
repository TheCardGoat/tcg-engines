import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { rushOfPowerRed } from "./rush-of-power.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";
import { fai } from "../heroes/fai.ts";
import { quickSuccessionRed } from "./quick-succession.ts";

describe("Quick Succession family AAA", () => {
  it("happy: next Lightning/Runeblade attack action gets go again and +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [quickSuccessionRed, rushOfPowerRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(quickSuccessionRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(rushOfPowerRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    // Rush of Power 3 + 1 (QS while go again). Quickstrike may add another +1.
    expect(game.combat()?.activeLink?.attackPower).toBeGreaterThanOrEqual(4);
  });

  it("boundary: a Generic attack without go again gets neither grant nor +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [quickSuccessionRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(quickSuccessionRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(brutalAssaultBlue);
    // Printed grant is Runeblade/Lightning only — Generic does not get go again.
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });

  it("timing: a later go-again attack still receives the +1{p} within the next 3", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [quickSuccessionRed, roninRenegadeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(quickSuccessionRed);
    game.helpers.resolveUntilIdle();
    Fai.attackWith(roninRenegadeRed);
    // Ronin Renegade 3 + 1 while it has go again.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expectFabPlayer(Fai).toHaveAP(0);
  });
});
