import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { nimblismBlue } from "./nimblism.ts";
import { cogwerxProngBotYellow } from "./cogwerx-prong-bot.ts";

/**
 * Cogwerx Prong Bot — Mechanologist Action - Attack, cost 3, 6{p}.
 *
 * Printed: When this hits a hero, you may put a steam counter on an item you
 * control with crank. Instant - {r}, discard this: Create a Golden Cog token.
 */

describe("Cogwerx Prong Bot AAA", () => {
  it("happy: a hit may put a steam counter on a crank item", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxProngBotYellow],
        arena: [goldenCog],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);

    Dash.playAttack(cogwerxProngBotYellow);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Dash, goldenCog).toHaveCounters(2, "steam");
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
  });

  it("boundary: declining the hit optional leaves the crank item unchanged", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxProngBotYellow],
        arena: [goldenCog],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);

    Dash.playAttack(cogwerxProngBotYellow);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Dash, goldenCog).toHaveCounters(1, "steam");
  });

  it("happy: paying {r} and discarding this from hand creates a Golden Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxProngBotYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);

    Dash.activate(cogwerxProngBotYellow);
    game.untilIdle();

    expectFabCard(Dash, cogwerxProngBotYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
  });
});
