import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { courage } from "./courage.ts";

describe("Courage (DTD232) AAA", () => {
  it("happy: playing an attack action destroys this and the attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [courage],
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

    expectCombat(game).toHaveAttackPower(5);
    expect(Bravo.zone("arena")).not.toContain(courage.canonicalId);
  });

  it("boundary: playing a non-attack action does not destroy Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [courage],
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

    expectFabCard(Bravo, courage).toBeIn("arena");
  });

  it("timing: activating a weapon attack also consumes Courage for +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [courage],
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
    expectCombat(game).toHaveAttackPower(5);
    expect(Bravo.zone("arena")).not.toContain(courage.canonicalId);
  });
});
