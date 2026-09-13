import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { goldenCog } from "./golden-cog.ts";

/**
 * Golden Cog (FAB353) — Mechanologist Token - Cog Item, Crank.
 * Printed: "Crank. This enters the arena with a steam counter. At the start
 * of your turn, destroy this unless you remove a steam counter from it."
 */
describe("Golden Cog (FAB353) AAA", () => {
  it("happy: entering with a steam counter, the cog survives its start phase by removing it", () => {
    const game = FabTestEngine.start(
      { hero: dash, arena: [goldenCog], hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, goldenCog).toHaveCounters(1, "steam");

    Dash.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(bravo).endTurn();
    game.helpers.untilIdle({ optionals: "accept" });

    expectFabCard(Dash, goldenCog).toBeIn("arena");
    expectFabCard(Dash, goldenCog).toHaveCounters(0, "steam");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: declining the removal destroys the cog at the start phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, arena: [goldenCog], hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, goldenCog).toHaveCounters(1, "steam");

    Dash.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(bravo).endTurn();
    game.helpers.untilIdle({ optionals: "decline" });

    expect(Dash.zone("arena")).not.toContain(goldenCog.canonicalId);
  });
});
