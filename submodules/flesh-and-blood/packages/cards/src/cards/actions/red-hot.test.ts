import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { headJabBlue } from "./head-jab.ts";
import { snatchRed } from "./snatch.ts";
import { redHotRed } from "./red-hot.ts";

describe("Red Hot (DRO009) AAA", () => {
  it("boundary: below chain link 4, a hit deals printed 4{p} without the reveal rider", () => {
    const game = FabTestEngine.start(
      { hero: dromai, hand: [redHotRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    Dromai.playAttack(redHotRed);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("happy: as chain link 4, the on-attack rider is granted", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [headJabBlue, headJabBlue, headJabBlue, redHotRed],
        resourcePoints: 2,
        actionPoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    Dromai.playAttack(headJabBlue);
    game.advanceCombatTo("resolution");
    Dromai.playAttack(headJabBlue);
    game.advanceCombatTo("resolution");
    Dromai.playAttack(headJabBlue);
    game.advanceCombatTo("resolution");
    Dromai.playAttack(redHotRed, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dromai, hand: [redHotRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dromai = game.as(dromai);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dromai.defendWith([redHotRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dromai).toHaveLife(19);
  });
});
