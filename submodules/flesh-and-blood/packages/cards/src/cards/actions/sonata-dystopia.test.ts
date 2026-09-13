import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { runechant } from "../tokens/runechant.ts";
import { sonataDystopiaBlue } from "./sonata-dystopia.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

describe("Sonata Dystopia preview behavior", () => {
  for (const x of [0, 2]) {
    it(`X=${x}: reduces the next attack cost, boosts it, and replenishes Runechants on hit`, () => {
      const game = FabTestEngine.start(
        {
          hero: chane,
          hand: [sonataDystopiaBlue, brutalAssaultBlue],
          arena: x === 2 ? [runechant, runechant] : [],
          resourcePoints: 2,
          deck: 6,
        },
        { hero: dash, hand: [], life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(chane);
      player.play(sonataDystopiaBlue, { xValue: x });
      game.untilIdle({ entityTargets: "maximum" });
      expectFabPlayer(player)
        .toHaveResourceCount(2 - x)
        .toHaveAP(1)
        .toHaveTokenCount("runechant", 0);
      player.playAttack(brutalAssaultBlue);
      expectFabPlayer(player).toHaveResourceCount(0);
      expectCombat(game)
        .toHaveAttackPower(4 + x)
        .toHaveKeyword("overpower");
      game.closeCombat();
      expectFabPlayer(game.as(dash)).toHaveLife(16 - x);
      expectFabPlayer(player).toHaveTokenCount("runechant", x);
    });
  }
});
