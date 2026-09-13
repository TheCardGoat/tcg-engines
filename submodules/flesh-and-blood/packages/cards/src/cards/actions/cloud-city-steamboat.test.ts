import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { cloudCitySteamboatRed } from "./cloud-city-steamboat.ts";

/**
 * Cloud City Steamboat, Red (SEA015) — Mechanologist Attack, cost 2, 6{p}.
 * Printed: "When this hits a hero, you may {t} a cog you control. If you do,
 * put a steam counter on a cog you control.
 * Twice per Turn Instant - {t} a cog you control: This gets +1{p}."
 */

describe("Cloud City Steamboat family AAA", () => {
  it("happy: a hero-hit may tap a cog then put steam on a cog", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cloudCitySteamboatRed],
        arena: [goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(cloudCitySteamboatRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Dash.target(goldenCog);
    Dash.target(goldenCog);

    expectFabCard(Dash, goldenCog).toHaveCounters(2, "steam");
  });

  it("boundary: a miss does not add steam", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cloudCitySteamboatRed],
        arena: [goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(cloudCitySteamboatRed);
    Bravo.defendWith(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, goldenCog).toHaveCounters(1, "steam");
    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("timing: twice-per-turn tap-a-cog grants +1{p} while the chain is open", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cloudCitySteamboatRed],
        arena: [goldenCog, goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(cloudCitySteamboatRed, { stopAt: "defend" });
    Bravo.pass();
    const cogs = Dash.cardsIn("arena", goldenCog);
    Dash.activate(cloudCitySteamboatRed);
    Dash.target(cogs[0]!);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(7);
    Dash.activate(cloudCitySteamboatRed);
    Dash.target(cogs[1]!);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(12);
  });
});
