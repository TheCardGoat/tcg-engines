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
import { scrapCompactorRed } from "./scrap-compactor.ts";

/**
 * Scrap Compactor (EVO129) — Mechanologist Action - Attack, cost 0, 3{p}/3{d},
 * Scrap.
 *
 * Printed: "Scrap. When this attacks, if it scrapped a card, you may play
 * your next Evo this turn as though it were an instant."
 *
 * Seat Teklovossen (not Dash). `playAttack` with scrap drains into the
 * unhandled `scrapped-a-card` marker (family `status/scrapped-a-card`). Pin
 * that rejection; still prove GY banish vs no-scrap and printed {p} on the stack.
 */

describe("Scrap Compactor (EVO129) AAA", () => {
  it("happy: scrap a GY item banishes it and this is a 3{p} attack on the stack", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapCompactorRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapCompactorRed, {
      scrap: true,
      scrapCard: grindingGearsBlue,
    });

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });

  it("boundary: empty GY, no scrap — this is still a 3{p} attack on the stack", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapCompactorRed],
        graveyard: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapCompactorRed);

    expect(Teklo.zone("banished")).toHaveLength(0);
    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });

  it("timing: declining scrap leaves the GY item; this is still a 3{p} attack on the stack", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [scrapCompactorRed],
        graveyard: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(scrapCompactorRed, { scrap: false });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(3);
  });
});
