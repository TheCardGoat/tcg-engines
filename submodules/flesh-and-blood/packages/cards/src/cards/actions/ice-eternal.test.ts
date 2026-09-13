import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { iceEternalBlue } from "./ice-eternal.ts";

/**
 * Ice Eternal (UPR109) — Elemental Wizard Action, Iyslander Specialization,
 * Ice Fusion.
 *
 * Printed: "Create X Frostbite tokens under target hero's control. Then, if
 * Ice Eternal was fused, deal arcane damage to that hero equal to the number
 * of Frostbites they control."
 *
 * Authored cost is omitted (printed X). Fusion reveal stays in hand (CR 8.3.17).
 */

describe("Ice Eternal (UPR109) AAA", () => {
  it("happy: fused X=2 creates 2 Frostbites then deals 2 arcane to that hero", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [iceEternalBlue, weaveIceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(iceEternalBlue, {
      xValue: 2,
      target: Dash.id,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Iyslander, weaveIceRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 2);
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: unfused X=2 creates Frostbites and omits the fused arcane rider", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [iceEternalBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(iceEternalBlue, { xValue: 2, target: Dash.id });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 2);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Iyslander, iceEternalBlue).toBeIn("graveyard");
  });

  it("timing: the fused rider damages the targeted hero, not an attack-target", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [iceEternalBlue, weaveIceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(iceEternalBlue, {
      xValue: 2,
      target: Dash.id,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expect(game.combat()).toBeNull();
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Iyslander, iceEternalBlue).toBeIn("graveyard");
  });
});
