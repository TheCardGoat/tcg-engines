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
import { cogwerxZeppelinRed } from "./cogwerx-zeppelin.ts";

/**
 * Cogwerx Zeppelin, Red (SEA018) — Mechanologist Attack, cost 2, 6{p}.
 * Printed: "When this hits a hero, you may {t} a cog you control. If you do,
 * create a Golden Cog token.
 * Twice per Turn Instant - {t} a cog you control: This gets +1{p}."
 */

describe("Cogwerx Zeppelin family AAA", () => {
  it("happy: a hero-hit may tap a cog then create a Golden Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxZeppelinRed],
        arena: [goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(cogwerxZeppelinRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Dash.target(goldenCog);

    expectFabCard(Dash, goldenCog).toBeIn("arena");
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
  });

  it("boundary: a miss does not create a Golden Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxZeppelinRed],
        arena: [goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(cogwerxZeppelinRed);
    Bravo.defendWith(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, goldenCog).toBeIn("arena");
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 0);
    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("timing: twice-per-turn tap-a-cog grants +1{p} while the chain is open", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxZeppelinRed],
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

    Dash.playAttack(cogwerxZeppelinRed, { stopAt: "defend" });
    Bravo.pass();
    const cogs = Dash.cardsIn("arena", goldenCog);
    Dash.activate(cogwerxZeppelinRed);
    Dash.target(cogs[0]!);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(7);
    Dash.activate(cogwerxZeppelinRed);
    Dash.target(cogs[1]!);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(12);
  });
});
