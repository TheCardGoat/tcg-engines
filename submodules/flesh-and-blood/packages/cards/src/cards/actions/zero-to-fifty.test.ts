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
import { zeroToFiftyRed } from "./zero-to-fifty.ts";

describe("Zero to Fifty (EVO162) AAA", () => {
  it("happy: boosting a Mechanologist card banishes it and grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToFiftyRed],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToFiftyRed, { boost: true });
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(Teklo, zeroToFiftyRed).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveAP(1);
  });

  it("boundary: without boosting it does not banish or gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToFiftyRed],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToFiftyRed, { boost: false });
    expectCombat(game).notToHaveKeyword("go-again");
    expect(Teklo.zone("banished")).toHaveLength(0);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Teklo).toHaveAP(0);
  });

  it("timing: go again from boost refunds the action point after the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToFiftyRed],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToFiftyRed, { boost: true });
    expectFabPlayer(Teklo).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Teklo).toHaveAP(1);
  });
});
