import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { ragingOnslaughtRed } from "./raging-onslaught.ts";
import { snatchRed } from "./snatch.ts";
import { seepingShadowsRed } from "./seeping-shadows.ts";
import { seepingShadowsBlue } from "./seeping-shadows.ts";

describe("Seeping Shadows (MON165) AAA", () => {
  it("happy: played from banished, the next cost-2-or-less attack action gains +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [brutalAssaultBlue],
        banished: [seepingShadowsRed],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(seepingShadowsRed, { from: "banished" });
    game.untilIdle();
    expectFabPlayer(Chane).toHaveAP(2);
    expectFabCard(Chane, seepingShadowsRed).toBeIn("graveyard");

    Chane.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    // Brutal Assault is cost 2: base 4 + 1 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: a cost-3 attack action neither gains nor consumes the grant", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [ragingOnslaughtRed, brutalAssaultBlue],
        banished: [seepingShadowsRed],
        resourcePoints: 8,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(seepingShadowsRed, { from: "banished" });
    game.untilIdle();

    Chane.must.playAttack(ragingOnslaughtRed);
    game.advanceCombatTo("defend");
    // Raging Onslaught costs 3: printed 7 only.
    expectCombat(game).toHaveAttackPower(7);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });

    Chane.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: Blood Debt drains an unplayed copy left in the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [seepingShadowsRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.endTurn();
    game.untilIdle();
    expectFabPlayer(Chane).toHaveLife(19);
  });

  it("happy: played from banished, the next cost-0 attack action gains +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        banished: [seepingShadowsBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(seepingShadowsBlue, { from: "banished" });
    game.untilIdle();
    expectFabPlayer(Chane).toHaveAP(2);
    expectFabCard(Chane, seepingShadowsBlue).toBeIn("graveyard");

    Chane.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // Snatch is cost 0: base 4 + 1 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).toHaveKeyword("go-again");
  });
});
