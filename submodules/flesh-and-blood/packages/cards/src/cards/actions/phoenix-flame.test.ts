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

describe("Phoenix Flame (FAI008) AAA", () => {
  it("happy: printed 0{p} Draconic attack with go again", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [phoenixFlameRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(phoenixFlameRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(0);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
  });

  it("happy: the second Draconic chain link gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, phoenixFlameRed],
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

    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  it("boundary: the first Draconic chain link stays at printed 0{p}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [phoenixFlameRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(fai).attackWith(phoenixFlameRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: go again refunds at chain-link resolution", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [phoenixFlameRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(phoenixFlameRed);
    expectFabPlayer(Fai).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(1);
  });
});
