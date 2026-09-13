import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiCintariSellsword } from "../heroes/kassai-cintari-sellsword.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "./snatch.ts";
import { oathOfSteelRed } from "./oath-of-steel.ts";

describe("Oath of Steel (EVR056) AAA", () => {
  it("happy: a weapon attack this turn gets a +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiCintariSellsword,
        hand: [oathOfSteelRed],
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiCintariSellsword);

    Kassai.play(oathOfSteelRed);
    game.passBoth();
    expectFabPlayer(Kassai).toHaveAP(2);
    Kassai.activateAttack(cintariSaber, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Kassai, cintariSaber).toHavePower(3);
  });

  it("boundary: a non-weapon attack does not get a +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiCintariSellsword,
        hand: [oathOfSteelRed, snatchRed],
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiCintariSellsword);

    Kassai.play(oathOfSteelRed);
    game.passBoth();
    Kassai.playAttack(snatchRed, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, cintariSaber).toHavePower(2);
  });

  it("timing: end phase removes +1{p} counters from weapons you control", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiCintariSellsword,
        hand: [oathOfSteelRed],
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiCintariSellsword);

    Kassai.play(oathOfSteelRed);
    game.passBoth();
    Kassai.activateAttack(cintariSaber);
    game.closeCombat();
    Kassai.endTurn();
    game.untilIdle();
    expect(Kassai.zone("graveyard")).toContain(oathOfSteelRed.canonicalId);
    expectFabCard(Kassai, cintariSaber).toHavePower(2);
  });
});
