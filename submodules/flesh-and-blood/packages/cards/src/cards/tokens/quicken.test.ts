import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { quicken } from "./quicken.ts";

describe("Quicken (RNR031) AAA", () => {
  it("happy: playing an attack action destroys this and the attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [quicken],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arena")).not.toContain(quicken.canonicalId);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: playing a non-attack action does not destroy Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [quicken],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, quicken).toBeIn("arena");
  });

  it("timing: activating a weapon attack also consumes Quicken for go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [quicken],
        weapon1: [anothos],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(anothos);
    expectCombat(game).toHaveKeyword("go-again");
    expect(Bravo.zone("arena")).not.toContain(quicken.canonicalId);
  });
});
