import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { zeroToSixtyBlue } from "./zero-to-sixty.ts";
import { bigShotRed } from "./big-shot.ts";

/**
 * Big Shot, Red (EVO153) — Mechanologist Action - Attack, cost 3, 6{p}, 3{d}.
 * Printed: "If you've boosted 2 or more times this turn, this gets +2{p}."
 */

describe("Big Shot (EVO153) AAA", () => {
  it("happy: after two boosts this turn, this gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToSixtyRed, zeroToSixtyBlue, bigShotRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Teklo.attackWith(zeroToSixtyBlue, { boost: true });
    game.advanceCombatTo("resolution");
    Teklo.attackWith(bigShotRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: without boosting this turn, this stays at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [bigShotRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.attackWith(bigShotRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: teklovossen,
        hand: [bigShotRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Teklo = game.as(teklovossen);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Teklo.defendWith([bigShotRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Teklo).toHaveLife(19);
    expectFabCard(Teklo, bigShotRed).toBeIn("graveyard");
  });
});
