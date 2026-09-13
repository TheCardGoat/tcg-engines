import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { dash } from "../heroes/dash.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { zipperHitRed } from "./zipper-hit.ts";

describe("Zipper Hit (ARC029) AAA", () => {
  it("happy: boosting a Mechanologist card grants go again and attacks for 5", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zipperHitRed],
        deck: [grindingGearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zipperHitRed, { boost: true });
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Teklo, zipperHitRed).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveAP(1);
  });

  it("boundary: without boosting it does not gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zipperHitRed],
        deck: [grindingGearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zipperHitRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Teklo).toHaveAP(0);
  });

  it("timing: go again from boost refunds the action point after the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zipperHitRed],
        deck: [grindingGearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zipperHitRed, { boost: true });
    expectFabPlayer(Teklo).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Teklo).toHaveAP(1);
  });
});
