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
import { scrapProspectorRed } from "./scrap-prospector.ts";

/**
 * Scrap Prospector (EVO135) — Mechanologist Action - Attack, cost 0, 3{p}/3{d},
 * Scrap.
 *
 * Printed: "Scrap. When this attacks, if it scrapped a card, gain {r}."
 * Seat Teklovossen. Scrap is `{ scrap: true, scrapCard }`.
 */

describe("Scrap Prospector (EVO135) AAA", () => {
  it("happy: scrap a GY item, then this attacks and you gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapProspectorRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapProspectorRed, {
      scrap: true,
      scrapCard: grindingGearsBlue,
    });

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectCombat(game).toHaveAttackPower(3);
    game.untilIdle();
    expectFabPlayer(Teklo).toHaveResourceCount(1);
  });

  it("boundary: empty GY, no scrap — this still attacks at 3{p} and you gain no {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapProspectorRed],
        graveyard: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapProspectorRed);

    expect(Teklo.zone("banished")).toHaveLength(0);
    expectCombat(game).toHaveAttackPower(3);
    game.untilIdle();
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });

  it("timing: declining scrap leaves the GY item and you gain no {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapProspectorRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapProspectorRed, { scrap: false });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(3);
    game.untilIdle();
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });
});
