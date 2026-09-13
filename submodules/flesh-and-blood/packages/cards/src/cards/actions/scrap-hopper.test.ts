import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { scrapHopperRed } from "./scrap-hopper.ts";

/**
 * Scrap Hopper (EVO108) — Mechanologist Action - Attack, cost 0, 3{p}/3{d}, Scrap.
 *
 * Printed: "Scrap. When this attacks, if it scrapped a card, create a Quicken token."
 *
 * Seat Teklovossen (not Dash). Scrap is `{ scrap: true, scrapCard }`.
 * `playAttack` evaluates `has-status: scrapped-a-card` (family status/scrapped-a-card).
 */

describe("Scrap Hopper (EVO108) AAA", () => {
  it("happy: scrap a GY item banishes it and creates a Quicken token", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapHopperRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapHopperRed, {
      scrap: true,
      scrapCard: grindingGearsBlue,
    });

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Teklo).toHaveTokenCount("quicken", 1);
  });

  it("boundary: empty GY, no scrap — still a 3{p} attack and no Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapHopperRed],
        graveyard: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapHopperRed);

    expect(Teklo.zone("banished")).toHaveLength(0);
    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Teklo).toHaveTokenCount("quicken", 0);
  });

  it("timing: declining scrap leaves the GY item; still no Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapHopperRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapHopperRed, { scrap: false });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Teklo).toHaveTokenCount("quicken", 0);
  });
});
