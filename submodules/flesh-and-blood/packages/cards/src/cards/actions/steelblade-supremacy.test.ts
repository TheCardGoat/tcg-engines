import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "./disable.ts";
import { prowlBlue } from "./prowl.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { steelbladeSupremacyRed } from "./steelblade-supremacy.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Steelblade Supremacy (WTR119) AAA", () => {
  it("targets an equipped weapon, grants +2 power until end of turn, and draws whenever it hits", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [steelbladeSupremacyRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Dori = game.as(dorinthea);

    Dori.play(steelbladeSupremacyRed, {
      targetInstanceId: Dori.ref(dawnblade).instanceId,
    });
    game.passBoth();
    Dori.activate(dawnblade);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
    expect(game.as(dash).life()).toBe(15);
    expect(Dori.handCount()).toBe(1);
  });
  it("does not draw when the modified weapon is fully defended", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [steelbladeSupremacyRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [disableRed, prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.play(steelbladeSupremacyRed, {
      targetInstanceId: Dori.ref(dawnblade).instanceId,
    });
    game.passBoth();
    Dori.activate(dawnblade);
    game.advanceCombatTo("defend");
    Dash.defendWith([disableRed, prowlBlue]);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expect(Dash.life()).toBe(20);
    expect(Dori.handCount()).toBe(0);
  });
  it("draws once for each of Dorinthea's two Dawnblade hits", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [steelbladeSupremacyRed],
        resourcePoints: 3,
        // Dorinthea increases the weapon's per-turn activation limit; she
        // does not grant go again or an action point. Supply the second AP so
        // this test isolates Supremacy's per-hit draw behavior.
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Dori = game.as(dorinthea);

    Dori.play(steelbladeSupremacyRed, {
      targetInstanceId: Dori.ref(dawnblade).instanceId,
    });
    game.passBoth();
    Dori.activate(dawnblade);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });

    Dori.activate(dawnblade);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expect(game.as(dash).life()).toBe(10);
    expect(Dori.handCount()).toBe(2);
  });
});
