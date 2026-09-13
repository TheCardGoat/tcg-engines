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
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { judgeJuryExecutionerRed } from "./judge-jury-executioner.ts";

describe("Judge, Jury, Executioner (HVY249) AAA", () => {
  it("happy: an aimed hit discards all but 1 card from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: judgeJuryExecutionerRed, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(azalea).attackWith(judgeJuryExecutionerRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: without an aim counter, a hit does not discard", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [judgeJuryExecutionerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(azalea).attackWith(judgeJuryExecutionerRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveHandCount(2);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [judgeJuryExecutionerRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Azalea.defendWith([judgeJuryExecutionerRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Azalea).toHaveLife(19);
  });
});
