import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { valiantDynamo } from "./valiant-dynamo.ts";

describe("Valiant Dynamo (MON107) AAA", () => {
  it("happy: Battleworn — first defend applies −1{d} and stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kassai, life: 20, legs: [valiantDynamo], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const legsId = Kassai.findCardInZone("legs", valiantDynamo);

    expectFabCard(Kassai, valiantDynamo).toHaveKeyword("battleworn");

    game.as(dash).attackWith(snatchRed);
    Kassai.defendWith(valiantDynamo);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Kassai, valiantDynamo).toBeIn("legs");
    expect(game.objectState(legsId).defenseCounterTotal).toBe(-1);
    expectFabPlayer(Kassai).toHaveLife(17);
  });

  it("boundary: equipment that does not defend gets no Battleworn counter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kassai, life: 20, legs: [valiantDynamo], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const legsId = Kassai.findCardInZone("legs", valiantDynamo);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Kassai, valiantDynamo).toBeIn("legs");
    expect(game.objectState(legsId).defenseCounterTotal ?? 0).toBe(0);
    expectFabPlayer(Kassai).toHaveLife(16);
  });

  it("happy: after 2+ weapon attacks this turn, end phase may remove a −1{d} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        legs: [valiantDynamo],
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        hand: [nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const legsId = Kassai.findCardInZone("legs", valiantDynamo);
    // Seed Battleworn −1{d} without spending the turn (fixture counters).
    game.setCounters(legsId, { defenseCounterTotal: -1 });
    expect(game.objectState(legsId).defenseCounterTotal).toBe(-1);

    Kassai.activateAttack(cintariSaber, { index: 0 });
    game.helpers.resolveRestOfCombat();
    Kassai.activateAttack(cintariSaber, { index: 1 });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveWeaponAttacksThisTurn(2);

    Kassai.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(game.objectState(legsId).defenseCounterTotal ?? 0).toBe(0);
    expectFabCard(Kassai, valiantDynamo).toBeIn("legs");
  });

  it("boundary: fewer than 2 weapon attacks does not offer end-phase −1{d} removal", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        legs: [valiantDynamo],
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const legsId = Kassai.findCardInZone("legs", valiantDynamo);
    game.setCounters(legsId, { defenseCounterTotal: -1 });

    Kassai.activateAttack(cintariSaber);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveWeaponAttacksThisTurn(1);

    Kassai.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(game.objectState(legsId).defenseCounterTotal).toBe(-1);
  });
});
