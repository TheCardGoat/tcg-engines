import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { speedDemonRed } from "./speed-demon.ts";

/**
 * Speed Demon (PEN065) — Mechanologist Action - Attack, Scrap.
 * The Hyper Driver rider belongs to this play declaration's actual Scrap
 * payment, not to an unrelated turn-wide destruction/name ledger.
 */

describe("Speed Demon (PEN065) AAA", () => {
  it("happy: scrapping a Hyper Driver creates the two-counter token", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [speedDemonRed],
        graveyard: [hyperDriverRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(speedDemonRed, { scrap: true, scrapCard: hyperDriverRed });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabCard(Teklo, hyperDriverRed).toBeIn("banished");
    expectFabPlayer(Teklo).toHaveTokenCount("hyper-driver", 1);
  });

  it("boundary: scrapping a differently named item does not satisfy the rider", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [speedDemonRed],
        graveyard: [grindingGearsBlue, hyperDriverRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(speedDemonRed, { scrap: true, scrapCard: grindingGearsBlue });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("banished");
    expectFabCard(Teklo, hyperDriverRed).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveTokenCount("hyper-driver", 0);
  });
});
