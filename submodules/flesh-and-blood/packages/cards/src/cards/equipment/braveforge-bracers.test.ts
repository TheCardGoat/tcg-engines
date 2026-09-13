import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { braveforgeBracers } from "./braveforge-bracers.ts";

describe("Braveforge Bracers (WTR116) AAA", () => {
  it("happy: after a weapon hits, the next weapon attack this turn gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        arms: [braveforgeBracers],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(dawnblade);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    Dori.activate(braveforgeBracers);
    game.passBoth();
    expectFabPlayer(Dori).toHaveAP(1);

    Dori.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("defend");

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: cannot activate unless a weapon you control has hit this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        arms: [braveforgeBracers],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dorinthea).expectActivationRejected(braveforgeBracers);
  });

  it("timing: once per turn — a second activation is rejected after a weapon hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        arms: [braveforgeBracers],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(dawnblade);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dori.activate(braveforgeBracers);
    Dori.expectActivationRejected(braveforgeBracers);
  });
});
