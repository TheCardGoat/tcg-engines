import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { goldenSkywardenYellow } from "./golden-skywarden.ts";

/**
 * Golden Skywarden (SEA004) — Pirate Mechanologist Action Attack, 7{p} 2{d}.
 *
 * Printed: Galvanize — When this defends, you may destroy an item you
 * control. If you do, this gets +1{d}. If a Golden Cog is destroyed this
 * way, create a Gold token and repeat this process.
 *
 * Same destroyed-this-way Golden Cog compare-amount as PEN165; repeat
 * until declined is the printed "repeat this process" after a Cog.
 */

describe("Golden Skywarden (SEA004) AAA", () => {
  it("happy: each Golden Cog destroyed this way creates a Gold and repeats", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [goldenSkywardenYellow],
        arena: [fabToken("golden-cog"), fabToken("golden-cog")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(goldenSkywardenYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    const cogs = Dash.cardsIn("arena", fabToken("golden-cog"));
    Dash.target(cogs[0]!);
    Dash.accept();
    Dash.target(cogs[1]!);
    Dash.decline();

    expectFabCard(Dash, goldenSkywardenYellow).toHaveDefense(4);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: a non-Cog item grants +1{d} and does not create Gold or repeat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [goldenSkywardenYellow],
        arena: [hyperDriverRed, fabToken("golden-cog")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(goldenSkywardenYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    Dash.target(hyperDriverRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, goldenSkywardenYellow).toHaveDefense(3);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
  });

  it("timing: declining the first optional creates no Gold and does not repeat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [goldenSkywardenYellow],
        arena: [fabToken("golden-cog"), fabToken("golden-cog")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(goldenSkywardenYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, goldenSkywardenYellow).toHaveDefense(2);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
