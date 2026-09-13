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
import { enflameTheFirebrandRed } from "./enflame-the-firebrand.ts";

describe("Enflame the Firebrand (PEN250) AAA", () => {
  it("happy: the second Draconic chain link grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, enflameTheFirebrandRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(enflameTheFirebrandRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(18);
    expectFabCard(Fai, enflameTheFirebrandRed).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: the first Draconic link does not grant go again or +2", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [enflameTheFirebrandRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(enflameTheFirebrandRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(18);
    expectFabPlayer(Fai).toHaveAP(0);
  });

  it("timing: the fourth Draconic link also gives this +2 power", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, phoenixFlameRed, phoenixFlameRed, enflameTheFirebrandRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(enflameTheFirebrandRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
