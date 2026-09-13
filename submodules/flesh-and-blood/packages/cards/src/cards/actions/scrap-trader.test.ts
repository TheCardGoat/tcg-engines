import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { scrapTraderRed } from "./scrap-trader.ts";

/**
 * Scrap Trader (EVO101) — Mechanologist Action. Scrap Scrap.
 *
 * Printed: Scrap / Scrap / Gain {r}{r} for each card this scrapped.
 */

describe("Scrap Trader (EVO101) AAA", () => {
  it("happy: scrapping one GY item gains {r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapTraderRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(scrapTraderRed, { scrap: true, scrapCard: grindingGearsBlue });
    game.untilIdle();

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectFabPlayer(Teklo).toHaveResourceCount(2);
    expectFabCard(Teklo, scrapTraderRed).toBeIn("graveyard");
  });

  it("boundary: without scraping, this gains no {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapTraderRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(scrapTraderRed);
    game.untilIdle();

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });

  it("timing: the {r}{r} are gained when the action resolves, not when it is announced", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapTraderRed],
        graveyard: [hyperDriverRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(scrapTraderRed, { scrap: true, scrapCard: hyperDriverRed });
    expectFabCard(Teklo, scrapTraderRed).toBeIn("stack");
    expectFabPlayer(Teklo).toHaveResourceCount(0);

    game.passBoth();
    game.untilIdle();
    expectFabPlayer(Teklo).toHaveResourceCount(2);
  });
});
