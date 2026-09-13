import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { legacyOfIkaruBlue } from "./legacy-of-ikaru.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Legacy of Ikaru (ASR026) AAA", () => {
  it("gives the current Ninja attack +1 in the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [headJabRed, legacyOfIkaruBlue], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(headJabRed);
    game.as(dash).defendWith([]);
    Katsu.pass();
    game.as(dash).pass();
    Katsu.play(legacyOfIkaruBlue);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("draws on hit when Edge of Autumn was the previous attack on the same combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [edgeOfAutumn],
        hand: [headJabRed, legacyOfIkaruBlue],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.activate(edgeOfAutumn);
    game.passBoth();
    game.advanceCombatTo("resolution");
    Katsu.attackWith(headJabRed);
    Dash.defendWith([]);
    Katsu.pass();
    Dash.pass();
    Katsu.play(legacyOfIkaruBlue);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Dash.life()).toBe(15);
    expect(Katsu.handCount()).toBe(1);
  });
});
