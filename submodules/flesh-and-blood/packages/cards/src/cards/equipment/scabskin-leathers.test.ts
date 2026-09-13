import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { scabskinLeathers } from "./scabskin-leathers.ts";

describe("Scabskin Leathers (WTR004) AAA", () => {
  it("happy: once-per-turn Action rolls a d6 and gains floor(roll/2) AP", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [scabskinLeathers],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    expectFabCard(Rhinar, scabskinLeathers).toHaveKeyword("battleworn");

    Rhinar.must.activate(scabskinLeathers);

    expectFabPlayer(Rhinar).toHaveAP(Math.floor(game.lastDieFace() / 2));
    expectFabCard(Rhinar, scabskinLeathers).toBeIn("legs");
  });

  it("boundary: once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [scabskinLeathers],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.activate(scabskinLeathers);
    Rhinar.expectActivationRejected(scabskinLeathers);
    expectFabCard(Rhinar, scabskinLeathers).toBeIn("legs");
  });

  it("keyword: Battleworn — first defend applies −1{d} and stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, legs: [scabskinLeathers], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const legsId = Rhinar.findCardInZone("legs", scabskinLeathers);

    game.as(dash).attackWith(snatchRed);
    Rhinar.defendWith(scabskinLeathers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, scabskinLeathers).toBeIn("legs");
    expect(game.objectState(legsId).defenseCounterTotal).toBe(-1);
    expectFabPlayer(Rhinar).toHaveLife(18);
  });
});
