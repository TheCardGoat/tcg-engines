import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { snatchRed } from "./snatch.ts";
import { fireTenetStrikeFirstRed } from "./fire-tenet-strike-first.ts";

describe("Fire Tenet: Strike First (CIN012) AAA", () => {
  it("happy: the next Draconic attack this combat chain gets +1", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [fireTenetStrikeFirstRed, phoenixFlameRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(fireTenetStrikeFirstRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.advanceCombatTo("resolution");

    Fai.attackWith(phoenixFlameRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Fai, fireTenetStrikeFirstRed).toBeIn("graveyard");
  });

  it("boundary: a non-Draconic attack does not get the +1", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [fireTenetStrikeFirstRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(fireTenetStrikeFirstRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
