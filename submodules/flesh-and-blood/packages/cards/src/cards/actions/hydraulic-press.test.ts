import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { hydraulicPressRed } from "./hydraulic-press.ts";

/**
 * Hydraulic Press (EVO102) — Mechanologist Action - Attack, cost 3, 6{p}. Scrap.
 *
 * Printed: When this attacks, if it scrapped a card, this gets overpower.
 * Module keywords list overpower unconditionally — pin if it is present without scrap.
 */

describe("Hydraulic Press family AAA", () => {
  it("happy: scrap a GY item then this gets overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hydraulicPressRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(hydraulicPressRed, {
      scrap: true,
      scrapCard: grindingGearsBlue,
    });

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("overpower");
  });

  it("boundary: no scrap does not grant overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hydraulicPressRed],
        graveyard: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(hydraulicPressRed);

    expect(Teklo.zone("banished")).toHaveLength(0);
    expectCombat(game).toHaveAttackPower(6).notToHaveKeyword("overpower");
  });

  it("timing: declining scrap leaves the GY item and does not grant overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hydraulicPressRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(hydraulicPressRed, { scrap: false });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("graveyard");
    expectCombat(game).notToHaveKeyword("overpower");
  });
});
