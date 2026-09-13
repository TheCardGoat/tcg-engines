import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { fatigueShotRed } from "./fatigue-shot.ts";

describe("Fatigue Shot (EVR094) AAA", () => {
  it("happy: a hit halves the defending hero's first AAC next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: fatigueShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(fatigueShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(15);

    Azalea.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: a miss does not halve their next AAC", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: fatigueShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(fatigueShotRed, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(20);

    Azalea.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the halved first AAC expires after that turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: fatigueShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(fatigueShotRed, { from: "arsenal" });
    game.closeCombat();
    Azalea.endTurn();
    game.untilIdle();

    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline" });
    Dash.endTurn();
    game.untilIdle();
    Azalea.endTurn();
    game.untilIdle();

    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
