import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { wreckerRompBlue } from "../actions/wrecker-romp.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { skeraStrapping } from "./skera-strapping.ts";

describe("Skera Strapping (PEN004) AAA", () => {
  it("happy: pitching a 6{p} card to pay an attack grants spellvoid", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arms: [skeraStrapping],
        hand: [wreckerRompBlue, brutalAssaultBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expectFabCard(Rhinar, skeraStrapping).notToHaveKeyword("spellvoid");
    Rhinar.must.pitch(wreckerRompBlue).playAttack(brutalAssaultBlue);
    game.passBoth();

    expectFabCard(Rhinar, skeraStrapping).toHaveKeyword("spellvoid");
  });

  it("boundary: without pitching a 6{p} card this has no spellvoid", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arms: [skeraStrapping],
        hand: [heartOfFyendalBlue, brutalAssaultBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.pitch(heartOfFyendalBlue).playAttack(brutalAssaultBlue);
    game.passBoth();

    expectFabCard(Rhinar, skeraStrapping).notToHaveKeyword("spellvoid");
  });

  it("timing: spellvoid is absent before the 6{p} pitch resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arms: [skeraStrapping],
        hand: [wreckerRompBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(rhinar), skeraStrapping).notToHaveKeyword("spellvoid");
  });
});
