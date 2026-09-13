import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { junkyardDoggRed } from "./junkyard-dogg.ts";

/**
 * Junkyard Dogg (EVO126) — Mechanologist Action - Attack, cost 3, 6{p}/3{d}, Scrap.
 *
 * Printed: "Scrap. When this attacks, if it scrapped a card, this gets +1{p}."
 *
 * `playAttack` evaluates `has-status: scrapped-a-card` (family status/scrapped-a-card).
 */

describe("Junkyard Dogg (EVO126) AAA", () => {
  it("happy: scrap a GY item banishes it; this gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [junkyardDoggRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(junkyardDoggRed, {
      scrap: true,
      scrapCard: grindingGearsBlue,
    });

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: empty GY, no scrap — still a 6{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [junkyardDoggRed],
        graveyard: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(junkyardDoggRed);

    expect(Teklo.zone("banished")).toHaveLength(0);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: declining scrap leaves the GY item and printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [junkyardDoggRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(junkyardDoggRed, { scrap: false });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(6);
  });
});
