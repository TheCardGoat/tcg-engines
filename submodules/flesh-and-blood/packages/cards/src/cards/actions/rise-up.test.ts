import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { riseUpRed } from "./rise-up.ts";

describe("Rise Up (FAI007) AAA", () => {
  it("happy: as chain link 4 this has dominate and extra power from Phoenix Flames", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, phoenixFlameRed, phoenixFlameRed, riseUpRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(riseUpRed);
    expectCombat(game).toHaveKeyword("dominate");
    // Rupture +X is twice the number of Phoenix Flames you control (3 chain links → +6).
    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: as the first link this stays 3{p} without the rupture dominate grant", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [riseUpRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(fai).playAttack(riseUpRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: dominate from rupture is only on chain link 4 or higher", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, riseUpRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(riseUpRed);
    expectCombat(game).toHaveAttackPower(3);
  });
});
