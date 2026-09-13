import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { backupProtocolRed } from "./backup-protocol.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { scrapHarvesterRed } from "./scrap-harvester.ts";

/**
 * Scrap Harvester (EVO132) — Mechanologist Action - Attack, 6{p}/3{d}, Scrap.
 *
 * Printed: "When this attacks, if it scrapped a card, put a steam counter on
 * an item you control with crank." Hyper Driver is not a crank item; Backup
 * Protocol is.
 */

describe("Scrap Harvester (EVO132) AAA", () => {
  it("happy: scrap then attack puts a steam counter on a crank item", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapHarvesterRed],
        arena: [{ card: backupProtocolRed, state: { steamCounters: 1 } }],
        graveyard: [grindingGearsBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapHarvesterRed, {
      scrap: true,
      scrapCard: grindingGearsBlue,
    });
    expectCombat(game).toHaveAttackPower(6);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectFabCard(Teklo, backupProtocolRed).toHaveCounters(2, "steam");
  });

  it("boundary: no scrap does not add steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapHarvesterRed],
        arena: [{ card: backupProtocolRed, state: { steamCounters: 1 } }],
        graveyard: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapHarvesterRed, { stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Teklo, backupProtocolRed).toHaveCounters(1, "steam");
  });

  it("timing: declining scrap leaves GY and steam unchanged", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapHarvesterRed],
        arena: [{ card: backupProtocolRed, state: { steamCounters: 1 } }],
        graveyard: [grindingGearsBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapHarvesterRed, { scrap: false, stopAt: "defend" });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("graveyard");
    expectFabCard(Teklo, backupProtocolRed).toHaveCounters(1, "steam");
  });
});
