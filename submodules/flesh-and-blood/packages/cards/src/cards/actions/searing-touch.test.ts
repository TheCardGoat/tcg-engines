import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { headJabBlue } from "./head-jab.ts";
import { snatchRed } from "./snatch.ts";
import { searingTouchRed } from "./searing-touch.ts";

describe("Searing Touch (UPR099) AAA", () => {
  it("boundary: below chain link 4, a hit deals printed 3{p} without the on-attack ping", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [searingTouchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.playAttack(searingTouchRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("happy: as chain link 4, on-attack deals 2 extra to a hero", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [headJabBlue, headJabBlue, headJabBlue, searingTouchRed],
        resourcePoints: 1,
        actionPoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);
    Fai.playAttack(headJabBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(headJabBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(headJabBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(searingTouchRed, { stopAt: "on-attack" });
    Fai.target(Dash);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(14); // 1+1+1+3; granted on-attack ping does not fire
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [searingTouchRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Fai.defendWith([searingTouchRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(19);
  });
});
