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
import { zeroToSixtyRed } from "./zero-to-sixty.ts";

describe("Zero to Sixty (ARC026) AAA", () => {
  it("happy: boosting a Mechanologist card grants go again and attacks for 4", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToSixtyRed],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToSixtyRed, { boost: true });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Teklo, zeroToSixtyRed).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveAP(1);
  });

  it("boundary: without boosting it does not gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToSixtyRed],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToSixtyRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Teklo).toHaveAP(0);
  });
});
