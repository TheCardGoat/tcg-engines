import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { dash } from "../heroes/dash.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { fullTiltRed } from "./full-tilt.ts";

describe("Full Tilt family AAA", () => {
  it("happy: boosting a Mechanologist card banishes it and grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [fullTiltRed],
        deck: [grindingGearsBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(fullTiltRed, { boost: true });
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Teklo, fullTiltRed).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveAP(1);
  });

  it("boundary: without boosting it does not banish or gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [fullTiltRed],
        deck: [grindingGearsBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(fullTiltRed, { boost: false });
    expectCombat(game).notToHaveKeyword("go-again");
    expect(Teklo.zone("banished")).toHaveLength(0);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Teklo).toHaveAP(0);
  });

  it("timing: go again from boost refunds the action point after the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [fullTiltRed],
        deck: [grindingGearsBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(fullTiltRed, { boost: true });
    expectFabPlayer(Teklo).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Teklo).toHaveAP(1);
  });
});
