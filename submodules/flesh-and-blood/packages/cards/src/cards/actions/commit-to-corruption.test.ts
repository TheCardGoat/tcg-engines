import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { corruptedCorpse } from "./corrupted-corpse.ts";
import { commitToCorruptionRed, commitToCorruptionYellow } from "./commit-to-corruption.ts";

/**
 * Commit to Corruption, Red — Shadow Necromancer Action, cost 0, go again.
 *
 * Printed: "Your next attack this turn gets +3{p} and \"When this hits, create
 * a Corrupted Corpse in your banished zone.\"\nGo again"
 */

describe("Commit to Corruption AAA", () => {
  it("happy: the next attack gets +3{p} and creates a Corrupted Corpse on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [commitToCorruptionRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(commitToCorruptionRed);
    game.untilIdle();
    expectFabPlayer(Malice).toHaveAP(1);

    Malice.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Malice, corruptedCorpse).toBeBanished();
    expectFabPlayer(Malice).toHaveTokenCount("corrupted-corpse", 0);
  });

  it("boundary: a miss still has +3{p} but creates no Corrupted Corpse", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [commitToCorruptionRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.play(commitToCorruptionRed);
    game.untilIdle();

    Malice.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Malice).toHaveTokenCount("corrupted-corpse", 0);
  });

  it("happy: yellow grants the printed +2{p} rather than the red +3", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [commitToCorruptionYellow, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(commitToCorruptionYellow);
    game.untilIdle();

    Malice.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Malice, corruptedCorpse).toBeBanished();
  });
});
