import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { brandWithCinderclawRed } from "./brand-with-cinderclaw.ts";
import { dragonPowerBlue } from "./dragon-power.ts";
import { lavaVeinLoyaltyRed } from "./lava-vein-loyalty.ts";

describe("Lava Vein Loyalty (FAI015) AAA", () => {
  it("happy: with 2+ Draconic chain links this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, dragonPowerBlue, lavaVeinLoyaltyRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(dragonPowerBlue);
    game.advanceCombatTo("resolution");
    Fai.attackWith(lavaVeinLoyaltyRed);

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: as the first Draconic chain link this spends the action point", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [lavaVeinLoyaltyRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(lavaVeinLoyaltyRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(0);
  });
});
